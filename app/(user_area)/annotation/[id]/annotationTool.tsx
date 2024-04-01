'use client'
import React, {useEffect, useState, useCallback} from "react";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import BackspaceIcon from '@mui/icons-material/Backspace';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import QuestionMarkTwoToneIcon from '@mui/icons-material/QuestionMarkTwoTone';
import KeyboardDoubleArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowLeftTwoTone';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import InfoCard from "./infoCard";
import { getSelectedIds, setTargetRef } from "./helper";
import AnnotationTextElement from "./annotationTextElement";
import { type User } from '@supabase/supabase-js'
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation'
import CommentSection from "./commentSection";
import CommentIcon from '@mui/icons-material/Comment';
import GuidelineElement from "./guidelineElement";


const AnnotationTool = ({user, params}: {user: User | null, params: any}) => {
    const supabase = createClient()
    const id = params.id
    const router = useRouter()
    const [annotationText, setAnnotationText] = useState<string[]>()
    const [citedTitle, setCitedTitle] = useState<string>()
    const [citedPubYear, setCitedPubYear] = useState<number>()
    const [citedAuthors, setCitedAuthors] = useState<string[]>()
    const [citedAbstract, setCitedAbstract] = useState<string>()
    const [citedDOI, setCitedDOI] = useState<string>()
    const [loading, setLoading] = useState<boolean>(true)
    const [prevAnnotation, setPrevAnnotation] = useState<Array<number>>([])
    const [uploading, setUploading] = useState<boolean>(false)
    const [unsafedChanges, setUnsafedChanges] = useState(false)
    const [nextAnnotationElement, setNextAnnotationElement] = useState<string>()
    const [toolStatus, setToolStatus] = useState('mark_tool')
    const [showInfoCard, setShowInfoCard] = useState<boolean>(true)
    const [showCommentSection, setShowCommentSection] = useState<boolean>(true)
    const [commentContent, setCommentContent] = useState<string>('')
    const [annotation, setAnnotation] = useState<Array<number>>([])
    const [showGuidelineElement, setShowGuidelineElement] = useState<boolean>(false)


    // calls to Databse

    // get annotation form id
    const getAnnotation = useCallback(async () => {
        try {
          setLoading(true)
          const { data, error, status} = await supabase
            .from('annotations')
            .select(`annotation_location, comment, quotes (ref_loc, paragraphs (text, documents (title, pub_year, abstract, doi, authors (first_name, last_name))))`)
            .eq('id', id)
            .single()
    
          if (error && status !== 406) {
            console.log(error)
            throw error
          }
    
          if (data) {
            const quotes : any = data.quotes
            setAnnotationText(setTargetRef(quotes.paragraphs.text, quotes.ref_loc))
            const document : any = quotes.paragraphs.documents
            setCitedAuthors(document.authors.map((auth: any) => auth.first_name + ' ' + auth.last_name))
            setCitedTitle(document.title)
            setCitedPubYear(document.pub_year)
            setCitedAbstract(document.abstract)
            setCitedDOI(document.doi)
            if (data.annotation_location) {
                setPrevAnnotation(data.annotation_location)
                setAnnotation(data.annotation_location)
            }
            if (data.comment) {
                setCommentContent(data.comment)
            } else {
            }
          }
        } catch (error) {
          alert('Error loading Annotation data!')
        } finally {
          setLoading(false)
        }
      }, [id, supabase])


      // get next annotation to work on
      const getAnnotations = useCallback(async () => {
        try {
          setLoading(true)
    
          const { data, error, status} = await supabase
            .from('annotations')
            .select(`id, status`)
            .eq('user_id', user?.id)
            .eq('status', 'outstanding')
            .neq('id', id)
            .limit(1)
            .single()
    
          if (error && status !== 406) {
            console.log(error)
            throw error
          }
    
          if (data) {
            setNextAnnotationElement(data.id)
          }
        } catch (error) {
          alert('Error loading outstanding Annotations data!')
        } finally {
          setLoading(false)
        }
      }, [user, supabase])

      //update annotation information
      const updateAnnotation = async (status: string) => {
        try {
            setUploading(true)
            if (status === 'annotated') {
                if (annotation.length === 0){
                    throw new Error('There is nothing annotated')
                }
                const { error } = await supabase
                        .from('annotations')
                        .update({status: status, annotation_location: annotation, comment: commentContent})
                        .eq('id', id)
                if(error){throw error}
            } else if (status === 'skipped') {
                const { error } = await supabase
                .from('annotations')
                .update({status: status, comment: commentContent})
                .eq('id', id)
                if(error){throw error}
            } else {
               throw new Error('Something went wrong')
            }

        } catch (error) {
            alert('Error uploading Annotations!')
        } finally {
            setUploading(false)
            if (status === 'annotated') {setUnsafedChanges(false)}
        }
      }

      // call database functions
      useEffect(() => {
        getAnnotation()
      }, [id, getAnnotation])

      useEffect(() => {
        getAnnotations()
      }, [id, user, getAnnotations])






    //set unmount event listener
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (true) {
                // Perform actions before the component unloads
                event.preventDefault();
                event.returnValue = '';
            }
          };
            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
          };    
        }, []);

    // add keyboard compatibility 
    useEffect(()=>{
        const handleKeyPress = (event:KeyboardEvent) => {
            if ((document.activeElement as HTMLElement).id === 'comment_field') {
                return
            }
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


    // update tools on toolStatus change
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

    // update markings on annotation change
    useEffect(()=>{
        annotationText && Array.from(Array(annotationText.length).keys()).forEach(i => {
            if(annotation.includes(i)){
                !(document.getElementById(`${id}_${i}`) as HTMLElement).classList.contains('marked') && (document.getElementById(`${id}_${i}`) as HTMLElement).classList.add('marked')
            } else {
                (document.getElementById(`${id}_${i}`) as HTMLElement).classList.contains('marked') && (document.getElementById(`${id}_${i}`) as HTMLElement).classList.remove('marked') 
            }
        })
        if (annotation === prevAnnotation) {
            setUnsafedChanges(false)
        } else {
            setUnsafedChanges(true)
        }
    },[annotation])


    // Event Handle functions
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

    const handleSkipp = () => {
        if(!commentContent){
            alert('no comment')
            return
        }
        updateAnnotation('skipped')
        nextAnnotationElement ? router.push('/annotation/' + nextAnnotationElement):
        router.push('/')
    }
    const handleSub = () => {
        updateAnnotation('annotated')
        nextAnnotationElement ? router.push('/annotation/' + nextAnnotationElement):
        router.push('/')
    }

    return (
        <div className="annotation_site_container" >
            <div className="annotation_container">
                {!loading &&
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
                    <div className="annotation_text_container" onMouseUp={handleMark}>
                        <div className="annotation_text">
                            {annotationText?.map((s,i) => <AnnotationTextElement id={id} i={i} s={s} key={i} setShowInfoCard={setShowInfoCard}/>)}
                        </div>
                    </div>
                    <div className="info_container">
                            {showInfoCard && 
                            <InfoCard 
                                title ={citedTitle as string}
                                authors={citedAuthors as string[]}
                                pub_year={citedPubYear as number}
                                abstract={citedAbstract as string}
                                doi = {citedDOI as string}
                                setShowInfoCard={setShowInfoCard}
                            />}
                            {showCommentSection &&
                            <CommentSection 
                                commentContent = {commentContent}
                                setCommentContent = {setCommentContent}
                                setShowCommentSection={setShowCommentSection}
                            />
                            }
                    </div>
                </div>
                }
                <div className="navigation_container">
                    <div className="help_button_container">
                        <button className="help_button" onClick={()=>setShowGuidelineElement(prev => !prev)} >
                            <QuestionMarkTwoToneIcon className="help_button_icon"/>
                        </button>
                    </div>
                    <div className="help_button_container" onClick={()=>setShowCommentSection(prev => !prev)}>
                        <button className="help_button" >
                            <CommentIcon className="help_button_icon"/>
                        </button>
                    </div>
                    <div className="prev_skip_button_container">
                        <button className="prev_button" onClick={() => router.back()}>
                            <KeyboardDoubleArrowLeftTwoToneIcon className="prev_button_icon"/>
                            <span className="prev_button_label">Prev</span>
                        </button>
                        <button className="skip_button" onClick={handleSkipp}>
                            <span className="skip_button_laber">Skip</span>
                            <KeyboardDoubleArrowRightTwoToneIcon className="skip_button_icon" />
                        </button>
                    </div>
                    <div className="submit_button_container">
                        <button className="submit_button" onClick={handleSub}>
                            <CheckTwoToneIcon className="submit_button_icon"/>
                        </button>
                    </div>
                </div>

            </div>
            { showGuidelineElement &&
            <GuidelineElement 
                setShowGuidelineElement={setShowGuidelineElement}
            />}
        </div>
    )
}
export default AnnotationTool