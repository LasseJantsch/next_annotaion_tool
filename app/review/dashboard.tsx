'use client'
import React, { useEffect, useState, useCallback } from "react";
import TableEntry from "./tableEntry";
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'

const Dashboard = ({ user }: { user: User | null }) => {
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [quoteElements, setQuoteElements] = useState<quoteElement[]>()


    type quoteElement = {
      id: string,
      annotation_count: number,
      inter_annotation_agreement: number
    }
    
    const getQuotes = useCallback(async () => {
      try {
        setLoading(true)
        const { data, error, status } = await supabase
          .from('quotes')
          .select('id, annotation_count, inter_annotation_agreement')
  
        if (error && status !== 406) {
          console.log(error)
          throw error
        }
  
        if (data) {
          setQuoteElements(data as quoteElement[])
        }
      } catch (error) {
        alert('Error loading ann data!')
      } finally {
        setLoading(false)
      }
    }, [user, supabase])

    
    useEffect(() => {
      getQuotes()
    }, [user, getQuotes])



    return(
      <div id="overview_contatiner">
          <div id="table_container">
              <div id="table_header_container">
                  <button id="id_header" className="table_header_label">ID</button>
                  <button id="status_header" className="table_header_label">Count</button>
                  <button id="annotation_count_header" className="table_header_label">IAA</button>
                  <button id="action_header" className="table_header_label"> </button>
              </div> 
              <div id="table_content_container">
                  {quoteElements &&
                  quoteElements.map((el) => {
                        return(
                          <TableEntry 
                              id={el.id}
                              count={el.annotation_count}
                              iaa={el.inter_annotation_agreement}
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