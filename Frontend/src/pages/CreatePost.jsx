import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Editor from '../Editor';



const CreatePost = () => {

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState('')
  const [redirect, setRedirect] = useState(false)


  const createNewPost = async (e) => {

    // console.log(localStorage.getItem('trendingblog-token'))

    const data = new FormData()
    data.set('title', title)
    data.set('summary', summary)
    data.set('content', content)
    data.set('file', files[0])
    data.set('token', localStorage.getItem('trendingblog-token'))

    e.preventDefault()

    // console.log(files)

    const response = await fetch(import.meta.env.VITE_APP_DEV_URL + '/post', {
      method: 'POST',
      body: data,
      credentials: 'include'
    })

    // console.log(response.json())

    if (response.ok) {
      setRedirect(true)
    }
  }


  if (redirect) {
    navigate('/')
  }


  return (
    <form onSubmit={createNewPost} className='create-post'>
      <input
        type="title"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={e => setSummary(e.target.value)}
        maxLength={300}
      />
      <input
        type="file"
        onChange={e => setFiles(e.target.files)}
      />
      <Editor
        value={content}
        onChange={setContent}
      />
      <button style={{ marginTop: '5px' }} className='btn'>Create Post</button>
    </form>
  )
}

export default CreatePost