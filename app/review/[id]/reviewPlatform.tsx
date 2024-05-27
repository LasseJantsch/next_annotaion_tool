'use client'
import React, {useEffect, useState, useCallback} from "react";
import InfoCard from "@/app/(components)/infoCard";
import { setTargetRef, unpackCitedPapers } from "@/app/(helpers)/helper";
import AnnotationTextElement from "@/app/(components)/annotationTextElement";
import { type User } from '@supabase/supabase-js'
import { createClient } from "@/utils/supabase/client";
import CommentSection from "@/app/(components)/commentSection";
import ErrorBanner from "@/app/(components)/errorBanner";


const AnnotationTool = ({user, params}: {user: User | null, params: any}) => {
  const supabase = createClient()
  const id = params.id

  const [activeAnnotation, setActiveAnnotation] =useState<string>('')
  const [annotationText, setAnnotationText] = useState<string[]>()
  const [citingPaper, setCitingPaper] = useState<Array<any>>([])
  const [targetPaper, setTargetPaper] = useState<Array<any>>([])
  const [citedPaper, setCitedPaper] = useState<Array<any>>([])
  const [sectionTitle, setSectionTitle] = useState<string>('')
  const [showMoreInformation, setShowMoreInformation] = useState<boolean>(false)
  const [sectionContent, setSectionContent] = useState<string[]>([])
  const [refLocMapping, setRefLocMapping] = useState<any>()

  const [activeTool, setActiveTool] = useState('information')
  const [showInfo, setShowInfo] = useState<string>('info_card')
  const [showGuidelineElement, setShowGuidelineElement] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [unsafedChanges, setUnsafedChanges] = useState(false)

  const [nextAnnotationElement, setNextAnnotationElement] = useState<string>()
  const [error, setError] = useState<string>('')

  const [commentContents, setCommentContents] = useState<any[]>([])

  const [annotation, setAnnotation] = useState<Array<number>>([])
  const [annotations, setAnnotations] = useState<any>([])
  const [prevAnnotation, setPrevAnnotation] = useState<Array<number>>([])

    // calls to Databse

    // get annotation form id
    const getAnnotations = useCallback(async () => {
      try {
        setLoading(true)
        const { data, error, status} = await supabase
          .from('refs')
          .select(`id, ref_loc, documents(id, title, authors, pub_year), paragraphs (text, section_title, documents(id, title, authors, pub_year), refs (ref_loc, documents(id, title, authors, pub_year))), annotations(id, context_location, comment, users(first_name, last_name))`)
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
          const refs : any = (data as any)
          setAnnotationText(setTargetRef(refs.paragraphs.text, refs.ref_loc))
          setAnnotation(Array(refs.paragraphs.text.length).fill(0))
          setTargetPaper(refs.documents)
          setCitingPaper([refs.paragraphs.documents])
          setCitedPaper(unpackCitedPapers(refs.paragraphs.refs))
          setSectionTitle(refs.paragraphs.section_title)
          if (refs.annotations) {
              let anns: any = {}
              let comms: any[] = []
              refs.annotations.forEach((e:any) => {
                anns[e.id] = e.context_location
                comms.push({'id': e.id, 'comment':e.comment, 'name': e.users.first_name})
              })
              setAnnotations(anns)
              setActiveAnnotation(refs.annotations[0].id)
              setCommentContents(comms)
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
    const getSectionContent = useCallback(async () => {
      try {
        setLoading(true)
        const { data, error, status} = await supabase
          .from('paragraphs')
          .select(`text`)
          .eq('doc_id', citingPaper[0]?.id)
          .eq('section_title', sectionTitle)
  
        if (error && status !== 406) {
          console.log(error)
          throw error
        }
  
        if (data) {
          console.log(data)
         setSectionContent( data.map((p:any) => {
          return p.text.split(';').join(' ')
         }))
        }
      } catch (error) {
        setError('Error loading section content!')
      } finally {
        setLoading(false)
      }
    }, [citingPaper, sectionTitle, supabase])

      // call database functions
      useEffect(() => {
        getAnnotations()
      }, [id, getAnnotations])

      useEffect(()=>{
        if (citingPaper && sectionTitle) {
            getSectionContent()
        }
      }, [citingPaper, sectionTitle,])

      useEffect(()=>{
        if (citedPaper) {
            const ref_mapping:any = {}
            citedPaper.forEach((p:any)=>{
                if (ref_mapping[p.ref_loc]){
                    ref_mapping[p.ref_loc].push(p.id)
                } else {
                    ref_mapping[p.ref_loc]=[p.id]
                }
            })
            setRefLocMapping(ref_mapping)
        }
      }, [citedPaper])

    useEffect(() => {
      console.log(activeAnnotation)
        if (annotations[activeAnnotation]) {
            setAnnotation(annotations[activeAnnotation])
        } else {
            setAnnotation([])
        }
    }, [activeAnnotation, annotations])

    const handleRefClick = (target: string) => {
      setShowInfo('info_card')
      const ids = refLocMapping[target]
      const target_elements = ids.map((id:string) =>document.getElementById(id))
      const parent_element = target_elements[0].parentElement
      target_elements.forEach((el:any, i:number) => {
          i===0 && el.scrollIntoView({behavior:'smooth', block:'center'})
          el.classList.add('active')})
      setTimeout(()=>{
          target_elements.forEach((el:any) => el.classList.remove('active'))
      }, 1000)
  }

    return (
      <div className="annotation_site_container" >
          {error && <ErrorBanner message={error} setError={setError}/>}
          <div className="annotation_container">
              {!loading &&
              <div className="work_area_container">
                  <div className="info_container">
                    {commentContents.map((commentContent:any, i:number) => {
                      return(
                       <CommentSection 
                        key={i}
                        name = {commentContent.name}
                        id = {commentContent.id}
                        setActiveAnnotation = {setActiveAnnotation}
                        commentContent = {commentContent.comment}
                      />)
                    })}
                  </div>
                  <div className="annotation_text_container">
                      <div className="annotation_text">
                          {annotationText?.map((s,i) =>{
                          return(
                              <AnnotationTextElement id={id} i={i} s={s} key={i} mark={annotation[i]} handleClick={handleRefClick}/>
                          )
                      })}
                      </div>
                  </div>
                  <div id="info_container" className="info_container">
                          <InfoCard 
                              title ='Citing Paper'
                              papers = {citingPaper}
                              sectionTitle = {sectionTitle}
                              sectionContent = {sectionContent}
                              expanded = {showMoreInformation}
                              handleExpand = {setShowMoreInformation}
                          />
                          <InfoCard 
                              title ='Cited Papers'
                              papers = {citedPaper}
                              target = {targetPaper[0]?.id}
                          />
                  </div>
              </div>
              }
          </div>
      </div>
  )
}
export default AnnotationTool