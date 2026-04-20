from azure.core.credentials import AzureKeyCredential
from azure.ai.language.questionanswering import QuestionAnsweringClient
from app.config import (
    AZURE_LANGUAGE_ENDPOINT,
    AZURE_LANGUAGE_KEY,
    PROJECT_NAME,
    DEPLOYMENT_NAME
)

def ask_question(question: str):
    client = QuestionAnsweringClient(
        endpoint=AZURE_LANGUAGE_ENDPOINT,
        credential=AzureKeyCredential(AZURE_LANGUAGE_KEY)
    )

    response = client.get_answers(
        question=question,
        project_name=PROJECT_NAME,
        deployment_name=DEPLOYMENT_NAME
    )

    if response.answers:
        return response.answers[0].answer

    return "Sorry, I couldn't find an answer."
