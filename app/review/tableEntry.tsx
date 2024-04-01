import React from "react";
import Link from "next/link";
import CheckIcon from '@mui/icons-material/Check';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import RemoveIcon from '@mui/icons-material/Remove';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

const TableEntry = ({id,count, iaa}:{id: string, count: number, iaa: number}) => {

    return(
        <div className="table_entry_container" key={id}>
            <div className="table_entry_content">
                <div className="entry_id entry_label">{id.substring(id.length-6)}</div>
                <div className="entry_annotation_count entry_label">{count}</div>
                <div className="entry_annotation_count entry_label">{iaa}</div>
                <div className="entry_action entry_label ">
                    <Link href={'/review/' + id}>
                        <button className="edit_entry_button">
                            <DriveFileRenameOutlineIcon className="edit_entry_button_icon"/>
                            <div className="edit_entry_label">
                                Edit
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
            <hr className="table_entry_hr"></hr>
        </div>
    )
}

export default TableEntry