import React from "react";
import { Card, Container } from "react-bootstrap";

const DataDeletion = () => {
    return(
        <Container className="mt-5">
            <Card>
                <Card.Header>
                    <h4>Data Deletion Request</h4>
                </Card.Header>
                <Card.Body>
                    <h6>How to Delete Your Data</h6>
                    <p><h6>(Only for users who register and login using Social Media platforms)</h6></p>
                    <p>
                        If you would like to delete your data from Universal Pet Care, please follow these steps:
                    </p>
                    <ol>
                        <li>Send an email to: <strong>universalpetcareproject@gmail.com</strong></li>
                        <li>Use the subject line: "Data Deletion Request"</li>
                        <li>Include your Facebook email address in the message</li>
                        <li>We will process your request within 30 days</li>
                    </ol>

                    <h6>What Data We Delete</h6>
                    <p>
                        When you request data deletion, we will permanently remove:
                    </p>
                    <ul>
                        <li>Your account Information</li>
                        <li>Your profile data</li>
                        <li>Any content you have created</li>
                        <li>Your login credentials</li>
                    </ul>

                    <h6>Contact Information</h6>
                    <p>
                        Email: <strong>universalpetcareproject@gmail.com</strong><br/>
                        Response time: Within 30 days
                    </p>
                </Card.Body>
            </Card>
        </Container>
    )
}
export default DataDeletion;
