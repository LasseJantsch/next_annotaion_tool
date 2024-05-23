'use client'
import React, { useEffect, useState, useCallback } from "react";
import TableEntry from "../(components)/tableEntry";
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import ErrorBanner from "../(components)/errorBanner";
import ProfileCard from "../(components)/profileCard";
import Table from "../(components)/table";

const Dashboard = ({ user }: { user: User | null }) => {
    const supabase = createClient()
    const [progressRatio, setProgressRatio] = useState<number[]>([])
    const [progressCounts, setProgressCounts] = useState<number[]>([])
    const columnNames = ['ID', 'Status','Comment','Created at', 'Updated at', '']
    const columnWidth = [100, 140, 100, 130, 150, 70]
    const columnSpecification = ['text_entry', 'status_entry','icon_entry', 'text_entry', 'text_entry', 'action_entry']
    const [profileLoading, setProfileLoading] = useState<boolean>()
    const [annLoading, setAnnLoading] = useState<boolean>()
    const [firstName, setFirstName] = useState<string>()
    const [lastName, setLastName] = useState<string>()

    const [annotationElements, setAnnotationElements] = useState<annotationElement[]>()
    const [nextAnnotationId, setNextAnnotationId] = useState<string>('')
    const [error, setError] = useState<string>('')

    type annotationElement = {
      id: string,
      status:string,
      comment: string,
      created_at: string,
      updated_at: string,
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
        setError('Error loading user data!')
      } finally {
        setProfileLoading(false)
      }
    }, [user, supabase])
    
    const getAnnotations = useCallback(async () => {
      try {
        setAnnLoading(true)
        const { data, error, status } = await supabase
          .from('annotations')
          .select('id, status, comment, created_at, updated_at')
          .eq('user_id', user?.id)
  
        if (error && status !== 406) {
          console.log(error)
          throw error
        }
  
        if (data) {
          setAnnotationElements(data)
          const next_element = data.find(el => el.status==='outstanding')
          next_element && setNextAnnotationId(next_element.id as string)
        }
      } catch (error) {
        setError('Error loading ann data!')
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
          var annotated = 0, skipped = 0, outstanding = 0          
          data.forEach(status => {
            switch (status.status) {
              case 'annotated':
                annotated = status.count
                break
              case 'skipped':
                skipped = status.count
                break
              case 'outstanding':
                outstanding = status.count
            }
          })
          setProgressCounts([annotated, skipped, outstanding])
        }
      } catch (error) {
        setError('Error loading Annotation Progress data!')
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

    useEffect(() => {
      if (progressCounts) {
        const total = progressCounts.reduce((a, b) => a + b, 0)
        const ratios = progressCounts.map(c => {
          return c/total
        })
        setProgressRatio(ratios)
      }
    }, [progressCounts])


    return(
      <div id="overview_contatiner">
        {error && <ErrorBanner message={error} setError={setError}/>}
          <ProfileCard ratios={progressRatio} count = {progressCounts} user_name={`${firstName} ${lastName}`} nextAnnotationId = {nextAnnotationId}/>
          <Table title="Tasks" classNames="overview_table" columnNames={columnNames} columnWidth={columnWidth}>
            {annotationElements &&
            annotationElements.map((el, i) => {
              const id = el.id.substring(el.id.length - 7)
              const created_at = el.created_at.substring(0,10)
              const updated_at = el.updated_at.substring(0,16).replace('T', ' ')
              return(
                <TableEntry 
                  key={i}
                  columnWidth = {columnWidth}
                  columnSpecification = {columnSpecification}
                  data = {[id, el.status, el.comment, created_at, updated_at, el.id]}
                />
              );
            })}
          </Table>
      </div>
    )
}

export default Dashboard