import admin from 'firebase-admin'
import serviceAccount from '~/../serviceAccountKey.json'

export const firebaseAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(
        serviceAccount as admin.ServiceAccount,
      ),
    })
  }

  return admin.app()
}

export const firebaseAdminAuth = firebaseAdmin().auth()
export const firebaseAdminStorage = firebaseAdmin().storage()
