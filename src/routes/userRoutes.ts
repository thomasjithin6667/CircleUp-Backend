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
router.put("/set-preferences",protect, updateUserTypeAndHiring);
router.put("/set-user-role",protect, updateUserRole);
router.put("/set-basic-information",protect,updateBasicInformation);
router.post('/user-suggestions',protect,userSuggestions);
router.get('/user-details/:userId',protect,getUserDetails);
router.post("/checkout-user",protect, initiatecheckout);
router.post("/validate-payment",protect,validatePayment);
router.post("/get-transactions",protect,getPremiumUserData);
router.post("/get-notifications",protect,getNotifications )
router.post("/refresh-token",protect,verifyRefreshToken)
router.get("/search",protect,searchAllCollections)



 




export default router;
