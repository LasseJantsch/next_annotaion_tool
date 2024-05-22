'use client'
import React, {useEffect, useState, useCallback} from "react";
import QuestionMarkTwoToneIcon from '@mui/icons-material/QuestionMarkTwoTone';
import KeyboardDoubleArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowLeftTwoTone';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import InfoCard from "./infoCard";
import { getSelectedIds, setTargetRef, unpackCitedPapers } from "./helper";
import AnnotationTextElement from "./annotationTextElement";
import { type User } from '@supabase/supabase-js'
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation'
import CommentSection from "./commentSection";
import CommentIcon from '@mui/icons-material/Comment';
import GuidelineElement from "./guidelineElement";
import ErrorBanner from "../../../(components)/errorBanner";
import AnnotationTools from "@/app/(user_area)/annotation/[id]/annotationTools";


const AnnotationTool = ({user, params}: {user: User | null, params: any}) => {
    const supabase = createClient()
    const id = params.id
    const router = useRouter()

    const [annotationText, setAnnotationText] = useState<string[]>()
    const [citingPaper, setCitingPaper] = useState<Array<any>>([])
    const [targetPaper, setTargetPaper] = useState<Array<any>>([])
    const [citedPaper, setCitedPaper] = useState<Array<any>>([])
    const [section_title, setSectionTitle] = useState<string>('')
    const [citedTitle, setCitedTitle] = useState<string>()
    const [citedPubYear, setCitedPubYear] = useState<number>()
    const [citedAuthors, setCitedAuthors] = useState<string[]>()
    const [citedAbstract, setCitedAbstract] = useState<string>()
    const [citedDOI, setCitedDOI] = useState<string>()

    const [activeTool, setActiveTool] = useState('information')
    const [showInfo, setShowInfo] = useState<string>('info_card')
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
            .select(`context_location, comment, refs (id, ref_loc, documents(title, authors, pub_year), paragraphs (text, section_title, documents(title, authors, pub_year), refs (documents(title, authors, pub_year))))`) //, cited_documents(documents('title', 'authors', 'pub_year))
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
            console.log(data)
            const refs : any = (data as any).refs
            setAnnotationText(setTargetRef(refs.paragraphs.text, refs.ref_loc))
            setAnnotation(Array(refs.paragraphs.text.length).fill(0))
            setTargetPaper(refs.documents)
            setCitingPaper([refs.paragraphs.documents])
            setCitedPaper(unpackCitedPapers(refs.paragraphs.refs))
            setSectionTitle(refs.paragraphs.section_title)
            if ((data as any).context_location) {
                setPrevAnnotation((data as any).context_location)
                setAnnotation((data as any).context_location)
            }
            if ((data as any).comment)  {
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
            event.preventDefault();
            (document.activeElement as HTMLElement).blur()
            switch (event.code){
                case 'Digit1':
                    setActiveTool('information')
                    break
                case 'Digit2':
                    setActiveTool('perception')
                    break
                case 'Digit3':
                    setActiveTool('background')
                    break
                case 'Digit4':
                    setActiveTool('erase')
                    break
                case 'Digit9':
                    handleResetAnnotation('reset');
                    break
                case 'Space':
                    setShowInfo('info_card');
                    break
                case 'KeyC':
                    setShowInfo('comment');
                    break
            }
        }
        document.addEventListener('keypress', handleKeyPress)
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
            document.removeEventListener('keyup', (e)=>e.preventDefault()) 
            document.removeEventListener('keydown', (e)=>e.preventDefault())

          }; 
    },[annotationText])


    // update tools on activeTool change
    useEffect(()=>{
        if (document.getElementById('erase_tool')) {
            switch (activeTool) {
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
    }, [activeTool])


    // Event Handle functions

    const handleResetAnnotation = (tool:string) => {
        if (annotationText && tool==='reset') {
            setActiveTool('information')
            setAnnotation(Array(annotationText.length).fill(0))
        }
    }

    const setAnnotationNumbers= (arr: Array<number>, type: number, setAnnotation: React.Dispatch<React.SetStateAction<Array<number>>>) => {
        var updatedArr = [...annotation]
        arr.forEach(i => {
            updatedArr[i] = type
        })
        setAnnotation(updatedArr)
    }

    const handleMark = () =>{
        const selected_ids: number[] = getSelectedIds()
        if (!selected_ids) {return}
        switch (activeTool) {
            case 'erase':
                setAnnotationNumbers(selected_ids, 0, setAnnotation)
                break
            case 'information':
                setAnnotationNumbers(selected_ids, 1, setAnnotation)
                break
            case 'perception':
                setAnnotationNumbers(selected_ids, 2, setAnnotation)
                break
            case 'background':
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
                    <AnnotationTools activeTool={activeTool} handleToolChange={setActiveTool} handleResetAnnotation={handleResetAnnotation}/>
                    <div className="annotation_text_container" onMouseUp={handleMark}>
                        <div className="annotation_text">
                            {annotationText?.map((s,i) => <AnnotationTextElement id={id} i={i} s={s} key={i} mark={annotation[i]} setShowInfo={setShowInfo}/>)}
                        </div>
                    </div>
                    {showInfo === 'info_card' &&
                    <div className="info_container">
                            <InfoCard 
                                title ='Citing Paper'
                                papers = {citingPaper}
                                section = {section_title}
                            />
                            <InfoCard 
                                title ='Target Citation'
                                papers = {targetPaper}
                            />
                            <InfoCard 
                                title ='Cited Papers'
                                papers = {citedPaper}
                            />
                    </div>}
                    {showInfo === 'comment' &&
                        <div className="info_container">
                        <CommentSection 
                            commentContent = {commentContent}
                            setCommentContent = {setCommentContent}
                        />
                    </div>}
                </div>
                }
                <div className="navigation_container">
                    <div className="help_button_container">
                        <button className="help_button" onClick={()=>setShowInfo('info_card')} >
                            <QuestionMarkTwoToneIcon className="help_button_icon"/>
                        </button>
                    </div>
                    <div className="help_button_container" onClick={()=>setShowInfo('comment')}>
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