import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Editor from "../Editor"


const EditPost = () => {

    const { id } = useParams()

    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect, setRedirect] = useState(false)


    useEffect(() => {
        fetch(import.meta.env.VITE_APP_DEV_URL + `/post/${id}`)
            .then((response) => {
                response.json().then(postInfo => {
                    setTitle(postInfo.title)
                    setContent(postInfo.content)
                    setSummary(postInfo.summary)

                })
            })
            .catch(err => console.log(err))
    }, [id])


    const updatePost = async (e) => {

        e.preventDefault()

        const data = new FormData()
        data.set('title', title)
        data.set('summary', summary)
        data.set('content', content)
        data.set('id', id)
        data.set('token', localStorage.getItem('trendingblog-token'))


        if (files?.[0]) {
            data.set('file', files?.[0])
        }

        const response = await fetch(import.meta.env.VITE_APP_DEV_URL + '/post', {
            method: 'PUT',
            body: data,
            credentials: 'include'
        })

        if (response.ok) {
            setRedirect(true)
        }
    }


    if (redirect) {
        navigate(`/post/${id}`)
    }

    return (
        <form onSubmit={updatePost}>
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
            <button style={{ marginTop: '5px' }} className="btn">Update Post</button>
        </form>
    )
}

export default EditPost