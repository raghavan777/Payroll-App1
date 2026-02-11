const mongoose = require("mongoose");
require("dotenv").config();

const Employee = require("./models/Employee");
const User = require("./models/User");
const TaxDeclaration = require("./models/TaxDeclaration");

async function checkData() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("MONGO_URI not found in environment");
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        const users = await User.find({ name: /Santhosh/i });
        console.log("Found Users:", JSON.stringify(users, null, 2));

        for (const user of users) {
            const employees = await Employee.find({ userId: user._id });
            console.log(`Employees for User ${user.name}:`, JSON.stringify(employees, null, 2));

            for (const emp of employees) {
                const declarations = await TaxDeclaration.find({ employeeId: emp._id });
                console.log(`Declarations for Employee ${emp.employeeCode}:`, JSON.stringify(declarations, null, 2));
            }
        }

        process.exit(0);
    } catch (err) {
        console.error("Error in checkData:", err);
        process.exit(1);
    }
}

checkData();
