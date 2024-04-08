import cron from 'node-cron';

import User from '../models/user/userModel'; 


async function runScheduledTask() {
  try {
    const users = await User.find({});
      const expiryDate: Date = new Date(user.premiumExpiryDate);

    for (const user of users) {
      
      if (user.premiumExpiryDate < new Date()) {
        user.isPremium = false;
        user.dailyJobsApplied = 0;
        await user.save();
      }
    }

    console.log('Cron job executed successfully');
  } catch (error) {
    console.error('Error executing cron job:', error);
  }
}


cron.schedule('0 0 * * *', runScheduledTask);

export default runScheduledTask; 