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
    const columnNames = ['ID', 'Count','IAA t1','IAA t2', 'IAA inf', 'IAA perc', 'IAA back','Created at', '']
    const columnWidth = [100, 50, 80, 80, 80, 80, 80, 120, 70]
    const columnSpecification = ['text_entry', 'text_entry','status_entry','status_entry','status_entry','status_entry','status_entry', 'text_entry', 'action_entry']
    const [profileLoading, setProfileLoading] = useState<boolean>()
    const [annLoading, setAnnLoading] = useState<boolean>()
    const [firstName, setFirstName] = useState<string>()
    const [lastName, setLastName] = useState<string>()

    const [referenceElements, setReferenceElements] = useState<annotationElement[]>()
    const [nextReferenceId, setNextReferenceId] = useState<string>('')
    const [error, setError] = useState<string>('')

    type annotationElement = {
      id: string,
      annotation_count: number,
      iaa_total1: number,
      iaa_total2: number,
      iaa_inf: number,
      iaa_perc: number,
      iaa_back: number,
      created_at: string,
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
    
    const getReferences = useCallback(async () => {
      try {
        const { data, error, status } = await supabase
          .from('refs')
          .select('id, annotation_count, iaa_total1, iaa_total2, iaa_inf, iaa_perc, iaa_back, created_at')
          .gte('annotation_count', 1)
  
        if (error && status !== 406) {
          console.log(error)
          throw error
        }
  
        if (data) {
          console.log(data)
          setReferenceElements(data)
        }
      } catch (error) {
        setError('Error loading ann data!')
      } finally {
        setAnnLoading(false)
      }
    }, [user, supabase])
    
    useEffect(() => {
      getProfile()
    }, [user, getProfile])

    useEffect(() => {
      getReferences()
      console.log(referenceElements)
    }, [user, getReferences])

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
          <ProfileCard ratios={progressRatio} count = {progressCounts} user_name={`${firstName} ${lastName}`}/>
          <Table title="Tasks" classNames="overview_table" columnNames={columnNames} columnWidth={columnWidth}>
            {referenceElements &&
            referenceElements.map((el, i) => {
              const id = el.id.substring(el.id.length - 7)
              const created_at = el.created_at.substring(0,10)
              return(
                <TableEntry 
                  key={i}
                  columnWidth = {columnWidth}
                  columnSpecification = {columnSpecification}
                  data = {[id, el.annotation_count, el.iaa_total1, el.iaa_total2, el.iaa_inf, el.iaa_perc, el.iaa_back, created_at, el.id]}
                />
              );
            })}
          </Table>
      </div>
    )
}

export default Dashboard