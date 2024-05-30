export const getSelectedIds = () => {
    //extract selection
    const selection: Selection = window.getSelection() as Selection

    // check wheter selection was made
    if (selection.isCollapsed || !selection.anchorNode?.parentNode || !selection.focusNode?.parentNode ) {
        return [] as number[]
    } else {
        //extract start and end of selection
        const start_id = Number((selection.anchorNode.parentNode as HTMLElement).id.split('_')[1])
        const start_filler = (selection.anchorNode.parentNode as HTMLElement).id.includes('filler')
        const end_id = Number((selection.focusNode.parentNode as HTMLElement).id.split('_')[1])
        const end_filler = (selection.focusNode.parentNode as HTMLElement).id.includes('filler')

        // init ids array
        var ids: number[] = []
        start_id < end_id ? ids.push(...range(start_id, end_id, start_filler)): ids.push(...range(end_id, start_id, end_filler))
        return ids
    }
}

export const range = (start: number , end: number, filler: boolean) => {
    const start_ = filler? start + 1: start
    return Array.from({length: end +1 - start_}, (v, k) => k +  start_)
}

      
export const setTargetRef = (text:string, loc:number) => {
    const res: string[] = text.split(';')
    if(res[loc].includes('REF]')) {
        res[loc] = res[loc].slice(0, res[loc].indexOf('R')) + 'T' + res[loc].slice(res[loc].indexOf('R'))
        return res
    } else {
        console.log(res[loc])
        alert('Cant find target reference token')
    }
  }

export const returnAuthorString = (authors:string) => {
    if (!authors){
        return('unknown authors')
    }
    const authors_arr = authors.split(' ,')
    if (authors_arr.length > 2) {
        return `${authors_arr[0]} et al.`
    } else {
        return authors_arr.join(', ')
    }
}

export const unpackCitedPapers = (data: any) => {
    var res:any = []
    data.forEach((r:any) => {
        const loc = r.ref_loc
        r.documents.forEach((d: any) => {
            d['ref_loc']=loc
            res.push(d)
        })
    });
    return res
}