import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveUserToFirestore = async (user) => {
  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName || name,
      email: user.email,
      role: "investor",
      mobile: user.phoneNumber || mobile,
    });
  } catch (err) {
    console.error("Error saving user to Firestore:", err);
  }
};

export const getUserFromFirestore = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.error("No such document!");
    }
  } catch (err) {
    console.error("Error getting user from Firestore:", err);
  }
};
