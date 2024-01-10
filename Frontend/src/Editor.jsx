import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'


const Editor = ({ value, onChange }) => {

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],               // custom button values
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            ['link', 'image'],
            ['clean']                                         // remove formatting button
        ]
    }


    return (
        <div className="content">
            <ReactQuill
                value={value}
                modules={modules}
                onChange={onChange}
            />
        </div>

    )
}

export default Editor