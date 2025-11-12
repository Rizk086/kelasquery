import { supabase } from "@/utils/supabase"

let uid = ""
let fname = ""
let uname = ""

try {
  let { data, error } = await supabase.auth.getUser()
  if (error) {
    throw error
  }
  if (data.user) {
    uid = data.user.id

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', uid)
      .single()

    if (profileError) {
      throw profileError
    }

    uname = profileData.username
  }
} catch (error) {
  uid = ""
}

// data to be exported
/* export const user_id = uid
export const fullName = fname
export const username = uname
export const isLoggedIn = user_id !== ""
 */
export default {
  user_id: uid,
  fullName: fname,
  username: uname,
  isLoggedIn: uid !== "",
}
