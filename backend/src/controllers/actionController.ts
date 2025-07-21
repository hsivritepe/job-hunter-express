import { Request, Response } from 'express';
import { Action, ActionTemplate } from '../models/Action';
import { AuthenticatedRequest } from '../middleware/auth';

// Action Template Controllers
export const createActionTemplate = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            name,
            description,
            category,
            isDefault,
            color,
            icon,
            order,
        } = req.body;

        const template = new ActionTemplate({
            name,
            description,
            category,
            isDefault: isDefault || false,
            color,
            icon,
            order: order || 0,
        });

        await template.save();

        res.status(201).json({
            message: 'Action template created successfully',
            template,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to create action template',
            error: error.message,
        });
    }
};

export const getActionTemplates = async (
    req: Request,
    res: Response
) => {
    try {
        const templates = await ActionTemplate.find().sort({
            order: 1,
            name: 1,
        });

        res.status(200).json({
            message: 'Action templates fetched successfully',
            templates,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to get action templates',
            error: error.message,
        });
    }
};

export const updateActionTemplate = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const template = await ActionTemplate.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!template) {
            return res.status(404).json({
                message: 'Action template not found',
            });
        }

        res.status(200).json({
            message: 'Action template updated successfully',
            template,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to update action template',
            error: error.message,
        });
    }
};

export const deleteActionTemplate = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        // Check if template is being used by any actions
        const actionCount = await Action.countDocuments({
            templateId: id,
        });
        if (actionCount > 0) {
            return res.status(400).json({
                message:
                    'Cannot delete template that is being used by actions',
                actionCount,
            });
        }

        const template = await ActionTemplate.findByIdAndDelete(id);

        if (!template) {
            return res.status(404).json({
                message: 'Action template not found',
            });
        }

        res.status(200).json({
            message: 'Action template deleted successfully',
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to delete action template',
            error: error.message,
        });
    }
};

// Action Instance Controllers
export const createAction = async (req: Request, res: Response) => {
    try {
        const { jobId, templateId, date, notes, scheduledDate } =
            req.body;

        const user = (req as AuthenticatedRequest).user;

        // Verify template exists
        const template = await ActionTemplate.findById(templateId);
        if (!template) {
            return res.status(404).json({
                message: 'Action template not found',
            });
        }

        const action = new Action({
            jobId,
            userId: user._id?.toString() || '',
            templateId,
            templateName: template.name,
            date: date ? new Date(date) : new Date(),
            notes,
            scheduledDate: scheduledDate
                ? new Date(scheduledDate)
                : undefined,
        });

        await action.save();

        res.status(201).json({
            message: 'Action created successfully',
            action,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to create action',
            error: error.message,
        });
    }
};

export const getActionsByJobId = async (
    req: Request,
    res: Response
) => {
    try {
        const { jobId } = req.params;
        const user = (req as AuthenticatedRequest).user;

        const actions = await Action.find({
            jobId,
            userId: user._id?.toString() || '',
        }).sort({ date: -1 });

        res.status(200).json({
            message: 'Actions fetched successfully',
            actions,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to get actions',
            error: error.message,
        });
    }
};

export const getActionsByUserId = async (
    req: Request,
    res: Response
) => {
    try {
        const user = (req as AuthenticatedRequest).user;

        const actions = await Action.find({
            userId: user._id?.toString() || '',
        }).sort({ date: -1 });

        res.status(200).json({
            message: 'Actions fetched successfully',
            actions,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to get actions',
            error: error.message,
        });
    }
};

export const updateAction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as AuthenticatedRequest).user;
        const updateData = req.body;

        const action = await Action.findOneAndUpdate(
            { _id: id, userId: user._id?.toString() || '' },
            updateData,
            { new: true, runValidators: true }
        );

        if (!action) {
            return res.status(404).json({
                message: 'Action not found',
            });
        }

        res.status(200).json({
            message: 'Action updated successfully',
            action,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to update action',
            error: error.message,
        });
    }
};

export const deleteAction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as AuthenticatedRequest).user;

        const action = await Action.findOneAndDelete({
            _id: id,
            userId: user._id?.toString() || '',
        });

        if (!action) {
            return res.status(404).json({
                message: 'Action not found',
            });
        }

        res.status(200).json({
            message: 'Action deleted successfully',
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to delete action',
            error: error.message,
        });
    }
};

// Helper function to add default actions to a new job
export const addDefaultActionsToJob = async (
    jobId: string,
    userId: string,
    appliedDate: Date
) => {
    try {
        // Get all default action templates
        const defaultTemplates = await ActionTemplate.find({
            isDefault: true,
        });

        // Create actions for each default template
        const actions = defaultTemplates.map((template) => ({
            jobId,
            userId,
            templateId: template._id,
            templateName: template.name,
            date: appliedDate,
        }));

        if (actions.length > 0) {
            await Action.insertMany(actions);
        }
    } catch (error) {
        console.error('Error adding default actions to job:', error);
    }
};
