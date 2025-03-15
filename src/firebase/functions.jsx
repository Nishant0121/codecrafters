import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const saveUserToFirestore = async (
  uid,
  name,
  email,
  mobile,
  panNumber
) => {
  try {
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      name: name,
      email: email,
      role: "investor",
      auth: panNumber,
      mobile: mobile,
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
