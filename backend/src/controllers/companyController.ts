import { Response } from 'express';
import { Company } from '../models/Company';
import { AuthenticatedRequest } from '../middleware/auth';

export const createCompany = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const { name, description, website, location } = req.body;
        const company = new Company({
            name,
            description,
            website,
            location,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCompanyById = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id);
        if (!company) {
            return res
                .status(404)
                .json({ message: 'Company not found.' });
        }
        res.status(200).json(company);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCompany = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const { id } = req.params;
        const { name, description, website, location } = req.body;
        const company = await Company.findByIdAndUpdate(
            id,
            { name, description, website, location },
            { new: true }
        );
        if (!company) {
            return res
                .status(404)
                .json({ message: 'Company not found.' });
        }
        res.status(200).json(company);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
