import admin from 'firebase-admin'
import { getStorage } from 'firebase-admin/storage'
import serviceAccount from '~/../serviceAccountKey.json'
import { env } from '~/env'

export const firebaseAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(
        serviceAccount as admin.ServiceAccount,
      ),
      storageBucket: env.FIREBASE_STORAGE_BUCKET,
    })
  }

  return admin.app()
}

export const firebaseAdminAuth = firebaseAdmin().auth()
export const firebaseAdminStorage = getStorage(firebaseAdmin())
