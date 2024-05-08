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
    const [commentContents, setCommentContents] = useState<any>({})
    const [annotations, setAnnotations] = useState<any>({})
    const [commentContent, setCommentContent] = useState<Object[]>()
    const [activeAnnotation, setActiveAnnotation] = useState<string>('')
    const [annotation, setAnnotation] = useState<number[]>([])

    // calls to Databse

    // get annotation form id
    const getAnnotations = useCallback(async () => {
        try {
          setLoading(true)
          const { data, error, status}:{data: any, error: any, status: any}= await supabase
            .from('refs')
            .select(`ref_loc, documents(title, authors, pub_year), paragraphs (text), annotations (context_location, comment, status, users(id))`)
            .eq('id', id)
            .single()
    
          if (error) {
            console.log(error)
            throw error
          }
          if (data) {
            console.log(data)
            setAnnotationText(setTargetRef(data.paragraphs.text, data.ref_loc))
            setAnnotation(Array(data.paragraphs.text.length).fill(0))
            setCitedAuthors(data.documents[0].authors.split(' ,'))
            setCitedTitle(data.documents[0].title)
            setCitedPubYear(data.documents[0].pub_year)
            if (data.annotations) {
                var anns:any = {}
                var comms:any = {}
                data.annotations.forEach((ann:any) => {
                    const id = ann.users.id
                    const location = ann.context_location
                    const comment = ann.comment
                    anns[id] = location
                    comms[id] = comment
                })
                setAnnotations(anns)
                setCommentContents(comms)
                setActiveAnnotation(data.annotations[0].users.id)
            }
          }
        } catch (error) {
            console.log(error)
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
        if (annotations[activeAnnotation]) {
            setAnnotation(annotations[activeAnnotation])
        } else {
            setAnnotation([])
        }
    }, [activeAnnotation, annotations])


    return (
        <div className="annotation_site_container" >
            <div className="annotation_container">
                {!loading &&                              
                <div className="work_area_container">
                    <div className="comments_container">
                    {commentContents &&
                    Object.entries(commentContents).map((comm:any)=> <CommentSection 
                        key={comm[0]}
                        id = {comm[0]}
                        activeId = {activeAnnotation}
                        setActiveId = {setActiveAnnotation}
                        commentContent = {comm[1]}
                    />)}
                    </div>
                    <div className="review_text_container">
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