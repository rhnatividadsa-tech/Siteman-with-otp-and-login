import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TasksService {
  constructor(private supabase: SupabaseService) {}

  private get db() {
    return this.supabase.getClient();
  }

  /** Fetch all tasks stored in volunteer_roles.tasks JSONB for a given role */
  async getRoleTasks(roleId: string) {
    const { data, error } = await this.db
      .from('volunteer_roles')
      .select('id, title, tasks')
      .eq('id', roleId)
      .single();

    if (error || !data) throw new NotFoundException(`Role ${roleId} not found`);

    const tasks: { title: string; description?: string }[] = data.tasks ?? [];
    return { role_id: roleId, role_title: data.title, tasks };
  }

  /** Append a new task object to volunteer_roles.tasks JSONB array */
  async addRoleTask(roleId: string, title: string, description?: string) {
    if (!title?.trim()) throw new BadRequestException('Task title is required');

    // Fetch existing tasks first
    const { data, error } = await this.db
      .from('volunteer_roles')
      .select('tasks')
      .eq('id', roleId)
      .single();

    if (error || !data) throw new NotFoundException(`Role ${roleId} not found`);

    const existingTasks: { title: string; description?: string }[] = data.tasks ?? [];

    // Prevent duplicate task titles (case-insensitive)
    if (existingTasks.some((t) => t.title.toLowerCase() === title.trim().toLowerCase())) {
      throw new BadRequestException(`Task "${title}" already exists for this role`);
    }

    const newTask = { title: title.trim(), description: description?.trim() ?? '' };
    const updatedTasks = [...existingTasks, newTask];

    const { error: updateError } = await this.db
      .from('volunteer_roles')
      .update({ tasks: updatedTasks })
      .eq('id', roleId);

    if (updateError) throw new BadRequestException(updateError.message);

    return { success: true, task: newTask, tasks: updatedTasks };
  }

  /** Insert task assignment records into volunteer_task_assignments */
  async assignTasks(
    applicationId: string,
    roleId: string,
    taskTitles: string[],
    assignedBy?: string,
    campaignId?: string,
  ) {
    if (!taskTitles?.length) throw new BadRequestException('No tasks selected');
    if (!applicationId) throw new BadRequestException('Application ID is required');

    // 1. Check if a deployment already exists for this application
    let deploymentId: string | null = null;
    const { data: existingDeployments } = await this.db
      .from('volunteer_deployments')
      .select('id, status')
      .eq('application_id', applicationId)
      .in('status', ['active', 'assigned'])
      .order('date_assigned', { ascending: false })
      .limit(1);

    if (existingDeployments && existingDeployments.length > 0) {
      deploymentId = existingDeployments[0].id;
    } else {
      // 2. Create a new deployment if one doesn't exist
      
      // Fallback: if campaignId not provided, fetch from role
      let finalCampaignId = campaignId;
      if (!finalCampaignId) {
        const { data: roleData } = await this.db
          .from('volunteer_roles')
          .select('campaign_id')
          .eq('id', roleId)
          .single();
        finalCampaignId = roleData?.campaign_id;
      }

      const { data: newDeployment, error: deployErr } = await this.db
        .from('volunteer_deployments')
        .insert({
          application_id: applicationId,
          damayan_operation_id: finalCampaignId,
          status: 'active',
          date_assigned: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (deployErr || !newDeployment) {
        throw new BadRequestException('Failed to create volunteer deployment: ' + (deployErr?.message || 'Unknown error'));
      }
      deploymentId = newDeployment.id;
    }

    // 3. Insert task assignments using the deploymentId
    const records = taskTitles.map((title) => ({
      deployment_id: deploymentId,
      role_id: roleId,
      task_title: title,
      status: 'pending',
      assigned_by: assignedBy ?? null,
      assigned_at: new Date().toISOString(),
    }));

    const { data, error } = await this.db
      .from('volunteer_task_assignments')
      .upsert(records, { onConflict: 'deployment_id,task_title' })
      .select();

    if (error) throw new BadRequestException(error.message);

    return {
      success: true,
      assigned: data?.length ?? taskTitles.length,
      message: `${data?.length ?? taskTitles.length} task(s) assigned successfully.`,
    };
  }
}
