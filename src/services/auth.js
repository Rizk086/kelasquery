import { supabase } from "@/utils/supabase"

export async function login(email, password) {
  if (email && password || email !== '' && password !== '') {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      throw new Error('Error logging in: ' + error.message)
    }

    return {
      ok: true,
      message: 'Login successful',
    }
  } else {
    throw new Error('Username or password is empty')
  }
}

export async function register(username, email, password) {
  if (username && password && email || username !== '' && password !== '' ) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        }
      }
    })

    if (error) {
      throw new Error('Error registering user: ' + error.message)
    }

    return {
      ok: true,
      message: 'Registration successful. Please check your email to confirm your account.',
    }
  } else {
    throw new Error("Please fill the information on the field")
  }
}

export async function signout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error('Error signing out: ' + error.message)
  }

  return {
    ok: true,
    message: 'Sign out successful',
  }
}
