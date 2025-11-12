import { supabase } from "@/utils/supabase.js"

export async function getAuthor(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('id', id)
    .single()

  if (error) {
    console.log('Error fetching authors:', error)
    return []
  }
  return data
}

export async function getPost(id) {
  if (id) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.log('Error fetching post:', error)
      throw new Error('lmao')
    }

    const returnData = {
        id: data.id,
        title: data.title,
        subject: data.subject,
        created_at: data.created_at,
        content: data.content,
        author: await getAuthor(data.user_id),
      }
    return returnData

  } else {
    const { data, error } = await supabase
      .from('posts')
      .select("id, title, subject, created_at, user_id")
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('Error fetching posts:', error)
    }

    const returnData = data.map(async (post) => {
      return {
        id: post.id,
        title: post.title,
        subject: post.subject,
        created_at: post.created_at,
        author: await getAuthor(post.user_id),
      }
    })
    return Promise.all(returnData)
  }
}

export async function sendPost(name, subject, content) {
  const { data: subjectText } = await supabase
    .from('subjects')
    .select('name')
    .eq('id', subject)
    .single()
  console.log([name, content, subjectText.name])
  if (name && content || name !== '' && content !== '') {
    let { data, error } = await supabase
      .from('posts')
      .insert([
        { title: name, subject: subjectText.name, content: content },
      ])

    if (error) {
      throw new Error( error.message )
    }

    return {
      ok: true,
      message: data?.content,
    }

  } else {
    throw new Error('Please fill the information on the field')
  }
}

export async function sendAnswer(post_id, content) {
  if (post_id && content) {
    let { data, error } = await supabase
      .from('answers')
      .insert([
        { post_id: post_id, content: content },
      ])

    if (error) {
      throw new Error(error.message)
    }
    return {
      ok: true,
      message: 'Answer submitted successfully',
    }
  } else {
    throw new Error ('Please fill the information on the field')
  }
}

export async function getAnswerFromPost(post_id) {
  if (post_id) {
    try {
      let { data, error } = await supabase
        .from('answers')
        .select('*')
        .eq('post_id', post_id)

      if (error) {
        throw new Error('Error fetching answers: ' + error.message)
      }

      const returnData = data.map(async (answer) => {
        return {
          id: answer.id,
          post_id: answer.post_id,
          content: answer.content,
          created_at: answer.created_at,
          author: await getAuthor(answer.user_id),
        }
      })
      return Promise.all(returnData)
    } catch (error) {
      console.error(error)
    }
  } else {
    console.error('Post ID is required to fetch answers.')
  }
}
