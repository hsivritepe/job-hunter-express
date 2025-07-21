import mongoose from 'mongoose';
import { ActionTemplate } from './models/Action';

// Default action templates
const defaultTemplates = [
    // Application actions
    {
        name: 'Applied',
        description: 'Submitted job application',
        category: 'application' as const,
        isDefault: true,
        color: '#3B82F6', // Blue
        icon: '📝',
        order: 1,
    },
    {
        name: 'Application Confirmed',
        description:
            'Received confirmation that application was received',
        category: 'application' as const,
        isDefault: false,
        color: '#10B981', // Green
        icon: '✅',
        order: 2,
    },

    // Interview actions
    {
        name: 'HR Interview Scheduled',
        description: 'Human Resources interview has been scheduled',
        category: 'interview' as const,
        isDefault: false,
        color: '#F59E0B', // Amber
        icon: '👥',
        order: 10,
    },
    {
        name: 'HR Interview Completed',
        description: 'Human Resources interview has been completed',
        category: 'interview' as const,
        isDefault: false,
        color: '#8B5CF6', // Purple
        icon: '✅',
        order: 11,
    },
    {
        name: 'Technical Interview Scheduled',
        description: 'Technical interview has been scheduled',
        category: 'interview' as const,
        isDefault: false,
        color: '#EF4444', // Red
        icon: '💻',
        order: 12,
    },
    {
        name: 'Technical Interview Completed',
        description: 'Technical interview has been completed',
        category: 'interview' as const,
        isDefault: false,
        color: '#8B5CF6', // Purple
        icon: '✅',
        order: 13,
    },
    {
        name: 'Coding Challenge Assigned',
        description:
            'Received coding challenge or take-home assignment',
        category: 'interview' as const,
        isDefault: false,
        color: '#06B6D4', // Cyan
        icon: '🧩',
        order: 14,
    },
    {
        name: 'Coding Challenge Completed',
        description:
            'Completed coding challenge or take-home assignment',
        category: 'interview' as const,
        isDefault: false,
        color: '#8B5CF6', // Purple
        icon: '✅',
        order: 15,
    },
    {
        name: 'Onsite Interview Scheduled',
        description: 'Onsite interview has been scheduled',
        category: 'interview' as const,
        isDefault: false,
        color: '#F97316', // Orange
        icon: '🏢',
        order: 16,
    },
    {
        name: 'Onsite Interview Completed',
        description: 'Onsite interview has been completed',
        category: 'interview' as const,
        isDefault: false,
        color: '#8B5CF6', // Purple
        icon: '✅',
        order: 17,
    },

    // Response actions
    {
        name: 'Offer Received',
        description: 'Received job offer',
        category: 'response' as const,
        isDefault: false,
        color: '#10B981', // Green
        icon: '🎉',
        order: 20,
    },
    {
        name: 'Offer Accepted',
        description: 'Accepted job offer',
        category: 'response' as const,
        isDefault: false,
        color: '#059669', // Emerald
        icon: '🎊',
        order: 21,
    },
    {
        name: 'Offer Declined',
        description: 'Declined job offer',
        category: 'response' as const,
        isDefault: false,
        color: '#DC2626', // Red
        icon: '❌',
        order: 22,
    },
    {
        name: 'Rejected',
        description: 'Application was rejected',
        category: 'response' as const,
        isDefault: false,
        color: '#DC2626', // Red
        icon: '😞',
        order: 23,
    },
    {
        name: 'Position Filled',
        description: 'Position was filled by another candidate',
        category: 'response' as const,
        isDefault: false,
        color: '#6B7280', // Gray
        icon: '🔒',
        order: 24,
    },

    // Follow-up actions
    {
        name: 'Follow-up Email Sent',
        description: 'Sent follow-up email after application',
        category: 'follow-up' as const,
        isDefault: false,
        color: '#8B5CF6', // Purple
        icon: '📧',
        order: 30,
    },
    {
        name: 'Thank You Email Sent',
        description: 'Sent thank you email after interview',
        category: 'follow-up' as const,
        isDefault: false,
        color: '#8B5CF6', // Purple
        icon: '🙏',
        order: 31,
    },
    {
        name: 'Reference Check',
        description: 'Company contacted references',
        category: 'follow-up' as const,
        isDefault: false,
        color: '#F59E0B', // Amber
        icon: '📞',
        order: 32,
    },

    // Other actions
    {
        name: 'Application Withdrawn',
        description: 'Withdrew application from consideration',
        category: 'other' as const,
        isDefault: false,
        color: '#6B7280', // Gray
        icon: '↩️',
        order: 40,
    },
    {
        name: 'Company Contacted Me',
        description: 'Company reached out proactively',
        category: 'other' as const,
        isDefault: false,
        color: '#3B82F6', // Blue
        icon: '📞',
        order: 41,
    },
];

export const seedActionTemplates = async () => {
    try {
        // Check if templates already exist
        const existingCount = await ActionTemplate.countDocuments();
        if (existingCount > 0) {
            console.log(
                'Action templates already exist, skipping seed'
            );
            return;
        }

        // Insert default templates
        await ActionTemplate.insertMany(defaultTemplates);
        console.log(
            `Successfully seeded ${defaultTemplates.length} action templates`
        );
    } catch (error) {
        console.error('Error seeding action templates:', error);
    }
};

// Run seed if this file is executed directly
if (require.main === module) {
    const mongoUri =
        process.env.MONGODB_URI ||
        'mongodb://localhost:27017/job-hunter';

    mongoose
        .connect(mongoUri)
        .then(() => {
            console.log('Connected to MongoDB');
            return seedActionTemplates();
        })
        .then(() => {
            console.log('Seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error:', error);
            process.exit(1);
        });
}
