import express  from "express";
import {
  registerUser,
  verifyOTP,
  loginUser,
  resendOtp,
  googleAuth,
  forgotOtp,
  forgotPassword,
  resetPassword,
  updateUserTypeAndHiring,
  updateBasicInformation,
  userSuggestions,
  getUserDetails,
  updateUserRole,
  verifyRefreshToken
} from "../controllers/userController";
import { protect } from "../middlewares/auth";
import { getPremiumUserData, initiatecheckout, validatePayment } from "../controllers/checkoutController";
import { getNotifications } from "../controllers/notificationController";
import { searchAllCollections } from "../controllers/searchController";

const router = express.Router();


 


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/register-otp", verifyOTP);
router.post("/resend-otp", resendOtp);
router.post("/google-auth", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-otp", forgotOtp);
router.put("/reset-password", resetPassword);
router.put("/set-preferences", updateUserTypeAndHiring);
router.put("/set-user-role", updateUserRole);
router.put("/set-basic-information",updateBasicInformation);
router.post('/user-suggestions',userSuggestions);
router.get('/user-details/:userId',getUserDetails);
router.post("/checkout-user", initiatecheckout);
router.post("/validate-payment",validatePayment);
router.post("/get-transactions",getPremiumUserData);
router.post("/get-notifications",getNotifications )
router.post("/refresh-token",verifyRefreshToken)
router.get("/search",searchAllCollections)


 




export default router;
