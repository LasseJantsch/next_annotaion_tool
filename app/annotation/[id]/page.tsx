'use client'
import React, {useEffect, useState} from "react";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import BackspaceIcon from '@mui/icons-material/Backspace';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import QuestionMarkTwoToneIcon from '@mui/icons-material/QuestionMarkTwoTone';
import KeyboardDoubleArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowLeftTwoTone';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import InfoCard from "./infoCard";
import { getSelectedIds } from "./helper";
import AnnotationTextElement from "./annotationTextElement";
import Link from 'next/link'
import { redirect } from 'next/navigation'

const AnnotationPage = ({params}: any) => {
    const title = 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks'
    const authors = ['Nils Reimers', 'Iryna Gurevych']
    const pub_year = 2019
    const abstract = `BERT (Devlin et al., 2018) and RoBERTa (Liu et al., 2019) has set a new state-of-the-art performance on sentence-pair regression tasks like semantic textual similarity (STS). However, it requires that both sentences are fed into the network, which causes a massive computational overhead: Finding the most similar pair in a collection of 10,000 sentences requires about 50 million inference computations (~65 hours) with BERT. The construction of BERT makes it unsuitable for semantic similarity search as well as for unsupervised tasks like clustering.
    In this publication, we present Sentence-BERT (SBERT), a modification of the pretrained BERT network that use siamese and triplet network structures to derive semantically meaningful sentence embeddings that can be compared using cosine-similarity. This reduces the effort for finding the most similar pair from 65 hours with BERT / RoBERTa to about 5 seconds with SBERT, while maintaining the accuracy from BERT.
    We evaluate SBERT and SRoBERTa on common STS tasks and transfer learning tasks, where it outperforms other state-of-the-art sentence embeddings methods.`

    const [id, setId] = useState<string>(params.id)
    const [ann, setAnn] = useState({
        "id": "ID60000",
        "annotator": "ID90000",
        "ref_id": "ID500000",
        "ref_loc": 6,
        "par_id": "ID100000",
        "status": "outstanding",
        "annotation_loc": []
    })
    const [next, setNext] = useState()
    const [prev, setPrev] = useState()
    const [par, setPar] = useState<paragraph>({
        "doc_id": "ID000001",
        "data": [
            "Recurrent",
            "neural",
            "networks,",
            "long",
            "short-term",
            "memory",
            "[TREF]",
            "and",
            "gated",
            "recurrent",
            "[REF]",
            "neural",
            "networks",
            "in",
            "particular,",
            "have",
            "been",
            "firmly",
            "established",
            "as",
            "state",
            "of",
            "the",
            "art",
            "approaches",
            "in",
            "sequence",
            "modeling",
            "and",
            "transduction",
            "problems",
            "such",
            "as",
            "language",
            "modeling",
            "and",
            "machine",
            "translation",
            "[GREF].",
            "Numerous",
            "efforts",
            "have",
            "since",
            "continued",
            "to",
            "push",
            "the",
            "boundaries",
            "of",
            "recurrent",
            "language",
            "models",
            "and",
            "encoder-decoder",
            "architectures",
            "[GREF]."
        ],
        "refs": [
            "ID500000",
            "ID500001",
            "ID500002",
            "ID500003"
        ]
    })
    const [unsafedChanges, setUnsafedChanges] = useState(false)
    const [toolStatus, setToolStatus] = useState('mark_tool')
    const [showInfoCard, setShowInfoCard] = useState<boolean>(true)
    const [annotation, setAnnotation] = useState<Array<number>>([])

    type paragraph = {
        doc_id: string;
        data: Array<string>;
        refs: string[]
    }

    //set unmount event listener

    // useEffect(() => {
    //     const handleBeforeUnload = (event: ) => {
    //         // Perform actions before the component unloads
    //         event.preventDefault();
    //         event.returnValue = '';
    //       };
    //       window.addEventListener('beforeunload', handleBeforeUnload);
    //       return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //       };    
    //     }, []);

    // add keyboard compatibility 
    useEffect(()=>{
        const handleKeyPress = (event:KeyboardEvent) => {
            (document.activeElement as HTMLElement).blur()
            switch (event.code){
                case 'Digit1':
                    setToolStatus('mark_tool')
                    break
                case 'Digit2':
                    setToolStatus('erase_tool')
                    break
                case 'Digit5':
                    handleResetAnnotation();
                    (document.getElementById('reset_button') as HTMLElement).classList.add('active');
                    setTimeout(() => {
                        (document.getElementById('reset_button') as HTMLElement).classList.remove('active')
                    }, 200);
                    break
                case 'Space':
                    setShowInfoCard(prev => !prev)
                    break
            }
        }
        document.addEventListener('keypress', handleKeyPress)
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
            document.removeEventListener('keyup', (e)=>e.preventDefault()) 
            document.removeEventListener('keydown', (e)=>e.preventDefault())

          }; 
    },[])

    // get Ann when id is updated
    useEffect(()=>{
        // if (id) {
        //     setAnn(getAnn(id))
        //     setNext(getAnn(`ID${Number(id.slice(2))+1}`))
        //     setPrev(getAnn(`ID${Number(id.slice(2))-1}`))
        // }
        console.log(id)
    },[id])

    //get par for id
    useEffect(()=>{
        // if(ann){
        //     let fetched_par = getPar(ann['par_id'])
        //     fetched_par['data'][ann['ref_loc']] = '[TREF]'
        //     setPar(fetched_par)
        // }
        console.log(ann)
    },[ann])

    //manipulate ref tag
    useEffect(()=>{
        console.log(par)
    },[par])

    useEffect(()=>{
        if (document.getElementById('erase_tool')) {
            switch (toolStatus) {
                case 'mark_tool':
                    (document.getElementById('mark_tool') as HTMLElement).className = 'active';
                    (document.getElementById('erase_tool') as HTMLElement).classList.remove('active')  
                    break
                case 'erase_tool':
                    (document.getElementById('mark_tool') as HTMLElement).classList.remove('active');
                    (document.getElementById('erase_tool') as HTMLElement).className = 'active'  
                    break
            }
        }
    }, [toolStatus])

    useEffect(()=>{
        par && Array.from(Array(par['data'].length).keys()).forEach(i => {
            if(annotation.includes(i)){
                !(document.getElementById(`${id}_${i}`) as HTMLElement).classList.contains('marked') && (document.getElementById(`${id}_${i}`) as HTMLElement).classList.add('marked')
            } else {
                (document.getElementById(`${id}_${i}`) as HTMLElement).classList.contains('marked') && (document.getElementById(`${id}_${i}`) as HTMLElement).classList.remove('marked') 
            }
        })
    },[annotation])


    const handleToolChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        setToolStatus((event.target as HTMLElement).id)
    }

    const handleResetAnnotation = () => {
        setToolStatus('mark_tool')
        setAnnotation([])
    }

    const handleMark = () =>{
        const selected_ids: number[] = getSelectedIds()
        if (!selected_ids) {return}
        switch (toolStatus) {
            case 'mark_tool':
                setAnnotation(prev => {
                    var add_ids:Array<number> =  []
                    selected_ids.forEach(id => {
                        !prev.includes(id) && add_ids.push(id)
                    })
                    return [...prev, ...add_ids]
                })
                break
            case 'erase_tool':
                setAnnotation(prev => prev.filter(id => !selected_ids.includes(id)))
        }
        (window.getSelection() as Selection).removeAllRanges()
    }
    const handlePrev = (event: React.MouseEvent<HTMLButtonElement>, id:string) => {
        prev? redirect('/annotation/' + encodeURIComponent(`ID${Number(id.slice(2))-1}`)):
        redirect('/')
    }
    const handleSkipp = (event: React.MouseEvent<HTMLButtonElement>, id:string) => {
        next ? redirect('/annotation/' + encodeURIComponent(`ID${Number(id.slice(2))+1}`)):
        redirect('/')
    }
    const handleSub = (event: React.MouseEvent<HTMLButtonElement>, id:string) => {
        next ? redirect('/annotation/' + encodeURIComponent(`ID${Number(id.slice(2))+1}`)):
        redirect('/')
    }
    return (
        <div className="annotation_site_container" onMouseUp={handleMark}>
            <div className="annotation_container">
                {ann && par &&
                <div className="work_area_container">
                    <div className="tools_container">
                        <div className="mark_erase_container">
                            <button id='mark_tool' className="active" onClick={handleToolChange}>
                                <DriveFileRenameOutlineIcon className="mark_button_icon"/>
                            </button>
                            <button id="erase_tool" className="" onClick={handleToolChange}>
                                <BackspaceIcon className="erase_button_icon" />
                            </button>
                        </div>
                        <div className="reset_button_container">
                            <button id="reset_button" className="reset_button" onClick={handleResetAnnotation}>
                                <RestartAltIcon className="reset_button_icon"/>
                            </button>
                        </div>
                    </div>
                    <div className="annotation_text_container" >
                        <div className="annotation_text">
                            {par['data'].map((s,i) => <AnnotationTextElement id={id} i={i} s={s} setShowInfoCard={setShowInfoCard}/>)}
                        </div>
                    </div>
                    <div className="info_container">
                            {showInfoCard && 
                            <InfoCard 
                                title ={title}
                                authors={authors}
                                pub_year={pub_year}
                                abstract={abstract}
                                setShowInfoCard={setShowInfoCard}
                            />}
                    </div>
                </div>
                }
                <div className="navigation_container">
                    <div className="help_button_container">
                        <button className="help_button" >
                            <QuestionMarkTwoToneIcon className="help_button_icon"/>
                        </button>
                    </div>
                    <div className="prev_skip_button_container">
                        <button className="prev_button" onClick={e => handlePrev(e, id)}>
                            <KeyboardDoubleArrowLeftTwoToneIcon className="prev_button_icon"/>
                            <span className="prev_button_label">Prev</span>
                        </button>
                        <button className="skip_button" onClick={(e) => handleSkipp(e, id)}>
                            <span className="skip_button_laber">Skip</span>
                            <KeyboardDoubleArrowRightTwoToneIcon className="skip_button_icon" />
                        </button>
                    </div>
                    <div className="submit_button_container">
                        <button className="submit_button" onClick={(e) => handleSub(e, id)}>
                            <CheckTwoToneIcon className="submit_button_icon"/>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default AnnotationPage