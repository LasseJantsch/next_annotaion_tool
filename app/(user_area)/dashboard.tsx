'use client'
import React, { useEffect, useState, useCallback } from "react";
import TableEntry from "./tableEntry";
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'

const Dashboard = ({ user }: { user: User | null }) => {
    const supabase = createClient()
    const [profileLoading, setProfileLoading] = useState<boolean>()
    const [annLoading, setAnnLoading] = useState<boolean>()
    const [firstName, setFirstName] = useState<string>()
    const [lastName, setLastName] = useState<string>()

    const [annotationElements, setAnnotationElements] = useState<annotationElement[]>()
    const [total, setTotal] = useState<number>()
    const [annotaded, setAnnotaded] =useState(0)
    const [skipped, setSkipped] = useState(0)

    type annotationElement = {
      id: string,
      status:string,
      quotes: {
        id: string,
        annotation_count: number
      }
    }

    const getProfile = useCallback(async () => {
      try {
        setProfileLoading(true)
  
        const { data, error, status } = await supabase
          .from('users')
          .select(`first_name, last_name`)
          .eq('id', user?.id)
          .single()
  
        if (error && status !== 406) {
          console.log(error)
          throw error
        }
  
        if (data) {
          setFirstName(data.first_name)
          setLastName(data.last_name)
        }
      } catch (error) {
        alert('Error loading user data!')
      } finally {
        setProfileLoading(false)
      }
    }, [user, supabase])
    
    const getAnnotations = useCallback(async () => {
      try {
        setAnnLoading(true)
        const { data, error, status } = await supabase
          .from('annotations')
          .select('id, status, quotes (id, annotation_count)')
          .eq('user_id', user?.id)
  
        if (error && status !== 406) {
          console.log(error)
          throw error
        }
  
        if (data) {
          console.log(data)
          setAnnotationElements(data as any)
          setTotal(data.length)
        }
      } catch (error) {
        alert('Error loading ann data!')
      } finally {
        setAnnLoading(false)
      }
    }, [user, supabase])

    const getAnnotationProgress = useCallback(async () => {
      try {
        setAnnLoading(true)
        const { data, error, status } = await supabase
        .from('progress_count')
        .select()
        .eq('user_id', user?.id)
  
  
        if (error && status !== 406) {
          console.log(error)
          throw error
        }
  
        if (data) {
          data.forEach(status => {
            switch (status.status) {
              case 'annotated':
                setAnnotaded(status.count)
                break
              case 'skipped':
                setSkipped(status.count)
                break
            }
          })

        }
      } catch (error) {
        alert('Error loading Annotation Progress data!')
      } finally {
        setAnnLoading(false)
      }
    }, [user, supabase])


    
    useEffect(() => {
      getProfile()
    }, [user, getProfile])

    useEffect(() => {
      getAnnotations()
    }, [user, getAnnotations])

    useEffect(() => {
      getAnnotationProgress()
    }, [user, getAnnotationProgress])


    return(
      <div id="overview_contatiner">
          <div id="progress_container">
              <div id="progress_title">Progress</div>
              {total &&
              <div id="progress_bar_container">
                  <div id="progress_bar_annotaded" className="progress_bar" style={{width: `${740 * annotaded/total}px`}}></div>
                  <div id="progress_bar_skipped" className="progress_bar" style={{width:`${740 * skipped/total}px`}}></div>
                  <div id="pogress_bar_outstanding" className="progress_bar" style={{width:`${740 * (total-annotaded-skipped)/total}px`}}></div>
              </div>}
          </div>
          <div id="table_container">
              <div id="table_header_container">
                  <button id="id_header" className="table_header_label">ID</button>
                  <button id="status_header" className="table_header_label">Status</button>
                  <button id="annotation_count_header" className="table_header_label">Count</button>
                  <button id="action_header" className="table_header_label"> </button>
              </div> 
              <div id="table_content_container">
                  {annotationElements &&
                  annotationElements.map((el) => {
                        return(
                          <TableEntry 
                              id={el.id}
                              status={el.status}
                              count={el.quotes.annotation_count}
                              key={el.id}
                          />
                        );
                  })}
              </div>
          </div>
      </div>
    )
}

export default Dashboard