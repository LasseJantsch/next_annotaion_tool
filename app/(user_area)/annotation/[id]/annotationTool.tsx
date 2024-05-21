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
import ErrorBanner from "../../../(components)/errorBanner";


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

    const [toolStatus, setToolStatus] = useState('mark_info_tool')
    const [showCommentSection, setShowCommentSection] = useState<boolean>(true)
    const [showInfoCard, setShowInfoCard] = useState<boolean>(true)
    const [showGuidelineElement, setShowGuidelineElement] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(true)
    const [uploading, setUploading] = useState<boolean>(false)
    const [unsafedChanges, setUnsafedChanges] = useState(false)

    const [nextAnnotationElement, setNextAnnotationElement] = useState<string>()
    const [error, setError] = useState<string>('')

    const [commentContent, setCommentContent] = useState<string>('')

    const [annotation, setAnnotation] = useState<Array<number>>([])
    const [prevAnnotation, setPrevAnnotation] = useState<Array<number>>([])
  

 


    // calls to Databse

    // get annotation form id
    const getAnnotation = useCallback(async () => {
        try {
          setLoading(true)
          const { data, error, status} = await supabase
            .from('annotations')
            .select(`context_location, comment, refs (id, ref_loc, documents(title, authors, pub_year), paragraphs (text))`) //, cited_documents(documents('title', 'authors', 'pub_year))
            .eq('id', id)
            .single()
    
          if (error && status !== 406) {
            console.log(error)
            throw new Error('Error loading Annotation data!')
          }
          if (error && status === 406){
            throw new Error("Insufficient permission")
          }
    
          if (data) {
            const refs : any = (data as any).refs
            console.log(refs)
            setAnnotationText(setTargetRef(refs.paragraphs.text, refs.ref_loc))
            setAnnotation(Array(refs.paragraphs.text.length).fill(0))
            const document : any = refs.documents[0]
            setCitedAuthors(document.authors.split(' ,'))
            setCitedTitle(document.title)
            setCitedPubYear(document.pub_year)
            setCitedAbstract(document.abstract)
            setCitedDOI(document.doi)
            if ((data as any).context_location) {
                setPrevAnnotation((data as any).context_location)
                setAnnotation((data as any).context_location)
            }
            if ((data as any).comment) {
                setCommentContent((data as any).comment)
            } else {
            }
          }
        } catch (error: any) {
            console.log(error)
          setError(error.message)
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
          setError('Error loading outstanding Annotations data!')
        } finally {
          setLoading(false)
        }
      }, [user, id, supabase])

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
                        .update({status: status, context_location: annotation, comment: commentContent})
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
            console.log(error)
            setError('Error uploading Annotations!')
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
            console.log(toolStatus)
            switch (toolStatus) {
                case 'mark_info_tool':
                    (document.getElementById('mark_info_tool') as HTMLElement).className = 'active';
                    (document.getElementById('mark_judge_tool') as HTMLElement).classList.remove('active');  
                    (document.getElementById('mark_backgr_tool') as HTMLElement).classList.remove('active');  
                    (document.getElementById('erase_tool') as HTMLElement).classList.remove('active')  
                    break
                case 'mark_judge_tool':
                    (document.getElementById('mark_judge_tool') as HTMLElement).className = 'active';
                    (document.getElementById('mark_info_tool') as HTMLElement).classList.remove('active');  
                    (document.getElementById('mark_backgr_tool') as HTMLElement).classList.remove('active');  
                    (document.getElementById('erase_tool') as HTMLElement).classList.remove('active') 
                    break
                case 'mark_backgr_tool':
                    (document.getElementById('mark_backgr_tool') as HTMLElement).className = 'active';
                    (document.getElementById('mark_info_tool') as HTMLElement).classList.remove('active');  
                    (document.getElementById('mark_judge_tool') as HTMLElement).classList.remove('active');  
                    (document.getElementById('erase_tool') as HTMLElement).classList.remove('active')
                    break
                case 'erase_tool':
                    (document.getElementById('erase_tool') as HTMLElement).className = 'active';
                    (document.getElementById('mark_info_tool') as HTMLElement).classList.remove('active'); 
                    (document.getElementById('mark_judge_tool') as HTMLElement).classList.remove('active');
                    (document.getElementById('mark_backgr_tool') as HTMLElement).classList.remove('active')
                    break
            }
        }
    }, [toolStatus])


    // Event Handle functions

    const handleToolChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        setToolStatus((event.target as HTMLElement).id)
    }

    const handleResetAnnotation = () => {
        if (annotationText) {
            setToolStatus('mark_info_tool')
            setAnnotation(Array(annotationText.length).fill(0))
        }
    }

    const setAnnotationNumbers= (arr: Array<number>, type: number, setAnnotation: React.Dispatch<React.SetStateAction<Array<number>>>) => {
        var updatedArr = [...annotation]
        arr.forEach(i => {
            updatedArr[i] = type
        })
        console.log(updatedArr)
        setAnnotation(updatedArr)
    }

    const handleMark = () =>{
        const selected_ids: number[] = getSelectedIds()
        if (!selected_ids) {return}
        switch (toolStatus) {
            case 'erase_tool':
                setAnnotationNumbers(selected_ids, 0, setAnnotation)
                break
            case 'mark_info_tool':
                setAnnotationNumbers(selected_ids, 1, setAnnotation)
                break
            case 'mark_judge_tool':
                setAnnotationNumbers(selected_ids, 2, setAnnotation)
                break
            case 'mark_backgr_tool':
                setAnnotationNumbers(selected_ids, 3, setAnnotation)
                break    
        };
        (window.getSelection() as Selection).removeAllRanges()
    }

    const handleSkipp = () => {
        if(!commentContent){
            setError('comment is required for skipp')
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
            {error && <ErrorBanner message={error} setError={setError}/>}
            <div className="annotation_container">
                {!loading &&
                <div className="work_area_container">
                    <div className="tools_container">
                        <div className="mark_erase_container">
                            <button id='mark_info_tool' className="active" onClick={handleToolChange}>
                                <DriveFileRenameOutlineIcon className="mark_button_icon"/>
                            </button>
                            <button id='mark_judge_tool' className="" onClick={handleToolChange}>
                                <DriveFileRenameOutlineIcon className="mark_button_icon"/>
                            </button>
                            <button id='mark_backgr_tool' className="" onClick={handleToolChange}>
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
                            {annotationText?.map((s,i) => <AnnotationTextElement id={id} i={i} s={s} key={i} mark={annotation[i]} setShowInfoCard={setShowInfoCard}/>)}
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