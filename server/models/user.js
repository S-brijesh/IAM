const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // employeeId: {
    //   type: String,
    //   unique: true,
    //   sparse: true
    // },

    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["EMPLOYEE", "HR_MANAGER", "IT_ADMIN"],
      default: "EMPLOYEE"
    },

    department: {
      type: String,
      enum: ["Engineering", "Human Resources", "IT Operations", "Sales", "Marketing", "Finance", "Operations"],
      default: "Engineering"
    },

    position: {
      type: String,
      default: "Employee"
    },

    joiningDate: {
      type: Date,
      default: Date.now
    },

    phoneNumber: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Generate employee ID before saving

// userSchema.pre('save', async function () {
//   if (!this.employeeId && this.isNew) {
//     const count = await mongoose.model('User').countDocuments();
//     this.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
//   }
// });

module.exports = mongoose.model("User", userSchema);

