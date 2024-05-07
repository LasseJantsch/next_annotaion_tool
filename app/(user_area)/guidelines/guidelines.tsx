import React from "react";

const Guidelines = () => {

    return(
        <div className="guidelines_container">
            <h3>Annotation Guidelines</h3>
            <p>We want to annotate citation contexts to build a database for the training of citation context extraction Models.<strong></strong>The scope is to mark the context of a citation in a given Paragraph. As the
            <strong>citation context,</strong>
            we understand the citation surrounding sentence segments, that semantically relate to the target reference.&nbsp;</p>
            <p>The annotations will be used to train a Siamese Bert model on a classification task, which learns to categorize previously unseen sentence parts belonging to the same citation, to different ones, or to be the author´s thought and thus no citation at all.</p>
            <p>For the annotation, we use an online platform, that supports the annotation process, in its structure and functionality. In the following paragraphs, we will introduce the annotation tool as well as describe the annotation task in detail.&nbsp;</p>
            <h3>The Task</h3>
            <p>The task is, to classify words of several sentences in a paragraph whether they relate to a citation marked as the target citation. The target citation will be symbolized by a [TREF] or [GTREF] tag, the latter referring to a group target reference consisting of several citations grouped (eg. “<em>citations can have multiple meanings</em>
            (Max 2020, Chors et al. 2005, Rudi and Black 2021).”). References in the text, that are not the target reference are symbolized by [REF] or [GREF] tags. A example sentence might look like this:</p>
            <div>
            <table>
                <tbody>
                <tr>
                    <td>
                    <em>Attention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences
                    </em>
                    <strong>[GREF]</strong>
                    <em>. In all but a few cases
                    </em>
                    <strong>[TREF]</strong>
                    <em>, however, such attention mechanisms are used in conjunction with a recurrent network</em>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <p>The task of the annotators is to select the part of the paragraph that directly relates to the target reference. In this example the short segment “<em>In all but a few cases</em>” directly in front of the [TREF] tag is clearly relating to the target reference. For the second part of the sentence, it is less clear, whether it belongs to the target reference. In such a more complex case, the judgment of the annotator is required. For a decision, the annotator should think about, what the scientist wants to prove or refer to with his reference. In this example, he wants to state that
            <em>the technology is mostly used in a specific way but in these cases it is different</em>
            <strong>.
            </strong>Thus one should include the segment `<em>attention mechanisms are used in conjunction with a recurrent network´</em>. The annotated context would look like this:</p>
            <div>
            <table>
                <tbody>
                <tr>
                    <td>
                    <span style={{color:'#CECECE'}}>
                        <em>Attention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences
                        </em>
                    </span>
                    <span style={{color:'#CECECE'}}>
                        <strong>[GREF]</strong>
                    </span>
                    <span style={{color:'#CECECE'}}>
                        <em>.
                        </em>
                    </span>
                    <em>In all but a few cases
                    </em>
                    <strong>[TREF]</strong>
                    <span style={{color:'#CECECE'}}>
                        <em>, however, such
                        </em>
                    </span>
                    <em>attention mechanisms are used in conjunction with a recurrent network</em>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <p>The annotator should always think about, the reason the researcher included the reference.</p>
        </div>
    )
}

export default Guidelines
