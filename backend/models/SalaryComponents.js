const mongoose = require('mongoose'); 

const SalaryComponentSchema = new mongoose.Schema({ 
    name: { type: String, required: true }, // Basic, HRA, PF 
    type: { 
        type: String, 
        enum: ['EARNING', 'DEDUCTION'], 
        required: true 
    }, 
    calculationType: { 
        type: String, 
        enum: ['FIXED', 'PERCENTAGE'], 
        required: true 
    }, 
    value: { type: Number, required: true }, // amount or % 
    basedOn: { 
        type: String, 
        default: 'BASIC' // future use 
    }, 
    isStatutory: { type: Boolean, default: false } 
}, { timestamps: true }); 

module.exports = mongoose.model('SalaryComponent', SalaryComponentSchema);