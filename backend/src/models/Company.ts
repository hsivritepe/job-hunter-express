import mongoose, { Schema, Document } from 'mongoose';
import { Company as CompanyInterface } from '../types';

export interface ICompany
    extends Omit<CompanyInterface, '_id' | 'createdAt' | 'updatedAt'>,
        Document {}

const companySchema = new Schema<ICompany>({
    name: String,
    description: String,
    website: String,
    location: String,
});

export const Company = mongoose.model<ICompany>(
    'Company',
    companySchema
);
