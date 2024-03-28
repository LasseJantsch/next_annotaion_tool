'use client'
import React, { useEffect, useState } from "react";
import TableEntry from "./tableEntry";

const Dashboard = () => {

    const [user, setUser] = useState()
    const [anns, setAnns] = useState({
      "ID60000": {
          "id": "ID60000",
          "annotator": "ID90000",
          "ref_id": "ID500000",
          "ref_loc": 6,
          "par_id": "ID100000",
          "status": "outstanding",
          "annotation_loc": []
      },
      "ID60001": {
          "annotator": "ID90001",
          "ref_id": "ID500000",
          "ref_loc": 6,
          "par_id": "ID100000",
          "status": "skipped",
          "annotation_loc": []
      },
      "ID60002": {
          "annotator": "ID90002",
          "ref_id": "ID500000",
          "ref_loc": 6,
          "par_id": "ID100000",
          "status": "annotated",
          "annotation_loc": []
      }})
    const [total, setTotal] = useState(1)
    const [annotaded, setAnnotaded] =useState(0)
    const [skipped, setSkipped] = useState(0)

    useEffect(()=>{
        // setUser(getUser('ID90000'))
    },[])

    useEffect(()=>{
        // user && setAnns(getAnns(user['annotations']))
    }, [user])

    useEffect(()=>{
        anns && calc_progress(anns)
    },[anns])

    const calc_progress = (anns: object) => {
        const keys = Object.keys(anns)
        setTotal(keys.length)
        let ann_count = 0
        let ski_count = 0
        keys.forEach((key:string) =>{
            anns[key as keyof typeof anns]['status'] === 'annotated'? ann_count++ : (anns[key as keyof typeof anns]['status'] === 'skipped' && ski_count++)
        })
        setAnnotaded(ann_count)
        setSkipped(ski_count)
    }


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
                  {anns &&
                  Object.keys(anns).map((key) => {
                        return(
                          <TableEntry 
                              id={key}
                              status={anns[key as keyof typeof anns]['status']}
                              count={0}
                          />
                        );
                  })}
              </div>
          </div>
      </div>
    )
}

export default Dashboard