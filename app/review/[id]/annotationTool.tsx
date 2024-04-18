'use client'
import React, {useEffect, useState, useCallback} from "react";
import InfoCard from "./infoCard";
import { setTargetRef } from "./helper";
import AnnotationTextElement from "./annotationTextElement";
import { type User } from '@supabase/supabase-js'
import { createClient } from "@/utils/supabase/client";
import CommentSection from "./commentSection";


const AnnotationTool = ({user, params}: {user: User | null, params: any}) => {
    const supabase = createClient()
    const id = params.id
    const [annotationText, setAnnotationText] = useState<string[]>()
    const [citedTitle, setCitedTitle] = useState<string>()
    const [citedPubYear, setCitedPubYear] = useState<number>()
    const [citedAuthors, setCitedAuthors] = useState<string[]>()
    const [citedAbstract, setCitedAbstract] = useState<string>()
    const [citedDOI, setCitedDOI] = useState<string>()
    const [loading, setLoading] = useState<boolean>(true)
    const [prevAnnotation, setPrevAnnotation] = useState<Array<number>>([])
    const [showInfoCard, setShowInfoCard] = useState<boolean>(true)
    const [commentContent, setCommentContent] = useState<Object[]>()
    const [annotations, setAnnotations] = useState<Object[]>([])
    const [activeAnnotation, setActiveAnnotation] = useState<string>('')
    const [annotation, setAnnotation] = useState<number[]>()

    // calls to Databse

    // get annotation form id
    const getAnnotations = useCallback(async () => {
        try {
          setLoading(true)
          const { data, error, status}:{data: any, error: any, status: any}= await supabase
            .from('quotes')
            .select(`ref_loc, paragraphs (text, documents (title, pub_year, abstract, doi, authors)), annotations (annotation_location, comment, status, users (id))`)
            .eq('id', id)
            .single()
    
          if (error) {
            console.log(error)
            throw error
          }
          if (data) {
            setAnnotationText(setTargetRef(data.paragraphs.text, data.ref_loc))
            setCitedAuthors(data.paragraphs.documents.authors.split(';'))
            setCitedTitle(data.paragraphs.documents.title)
            setCitedPubYear(data.paragraphs.documents.pub_year)
            setCitedAbstract(data.paragraphs.documents.abstract)
            setCitedDOI(data.paragraphs.documents.doi)
            if (data.annotations) {
                var anns:any = []
                data.annotations.forEach((ann:any) => anns.push({"id": ann.users.id, "location":ann.annotation_location}))
                setAnnotations(anns)
                var comms:any = []
                data.annotations.forEach((ann:any) => comms.push({"id": ann.users.id, "comment":ann.comment}))
                setCommentContent(comms)
                setActiveAnnotation(data.annotations[0].users.id)
            }
          }
        } catch (error) {

          alert('Error loading Annotation data!')
        } finally {
          setLoading(false)
        }
      }, [id, supabase])

      // call database functions
      useEffect(() => {
        getAnnotations()
      }, [id, getAnnotations])

    useEffect(() => {
        for(let i=0;i< annotations.length; i++) {
            if ((annotations[i] as any)['id']===activeAnnotation) {
                setAnnotation((annotations[i] as any)['location'])
            }
        }
    }, [activeAnnotation, annotations])
    
    //update markings on annotation change
    useEffect(()=>{
        annotationText && Array.from(Array(annotationText.length).keys()).forEach(i => {
            if(annotation?.includes(i)){
                !(document.getElementById(`${id}_${i}`) as HTMLElement).classList.contains('marked') && (document.getElementById(`${id}_${i}`) as HTMLElement).classList.add('marked')
            } else {
                (document.getElementById(`${id}_${i}`) as HTMLElement).classList.contains('marked') && (document.getElementById(`${id}_${i}`) as HTMLElement).classList.remove('marked') 
            }
        })
    },[annotation, annotationText, id])


    return (
        <div className="annotation_site_container" >
            <div className="annotation_container">
                {!loading &&                              
                <div className="work_area_container">
                    <div className="comments_container">
                    {commentContent &&
                    commentContent.map((comm:any)=> <CommentSection 
                        key={comm.id}
                        id = {comm.id}
                        activeId = {activeAnnotation}
                        setActiveId = {setActiveAnnotation}
                        commentContent = {((comm as any).comment )}
                    />)}
                    </div>
                    <div className="review_text_container">
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
                    </div>
                </div>
                }
            </div>
        </div>
    )
}
export default AnnotationTool