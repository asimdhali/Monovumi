import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

/*
  পোস্ট Home Feed-এ সংরক্ষণ
*/
export async function saveHomeFeedPost(post) {
  console.log("Saving Home Feed post:", post);

  await setDoc(
    doc(db, "homeFeed", String(post.id)),
    {
      ...post,
    },
    {
      merge: true,
    },
  );

  console.log("Home Feed post saved successfully:", post.id);
}

/*
  পোস্ট Home Feed থেকে মুছে ফেলা
*/
export async function deleteHomeFeedPost(postId) {
  await deleteDoc(doc(db, "homeFeed", String(postId)));
}
