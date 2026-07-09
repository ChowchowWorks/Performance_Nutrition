from chatbot_actual.prompts import *
from chatbot_actual.config import *
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import Literal
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

llm = ChatOpenAI(model="gpt-4.1-nano", temperature=0, max_tokens=1024)

## Casual Conversation LLM 
casual_llm = casual_prompt | ChatOpenAI(model = "gpt-4.1-nano", temperature = 0.4, max_tokens = 1024)

## Analysis Router LLM 

class query_class(BaseModel):
  datasource: Literal["vectorstore", "casual_chat"] = Field(
        ...,
        description="Given a user question choose to route it to casual chat or a vectorstore.",
  )

analysis_llm = llm.with_structured_output(query_class)

analysis_router = route_prompt | analysis_llm

# Document Grader 

class grading_class(BaseModel):
  datasource: Literal["Relevant", "Somewhat", "Irrelevant"] = Field(
      ...,
      description = "Given retrieved documents determine if they are relevant or not.",
  )

grade_llm = llm.with_structured_output(grading_class)

grader = grade_prompt | grade_llm

## Intent Detection LLM 

class intent_class(BaseModel):
  datasource: Literal['DEFINE', 'EXPLAIN', 'PROCEDURE', 'ADVICE', 'COMPARISON', 'GENERAL'] = Field(
      ...,
      description = 'Determine the intent of the user in asking this particular query'
  )

intent_llm = llm.with_structured_output(intent_class)

intent_router = intent_prompt | intent_llm

## Stepback Translation 

stepback = step_back_prompt | llm | StrOutputParser()

## Output Generation 

generator = RunnableLambda(lambda x: {
    "DEFINE": define_prompt | llm | StrOutputParser(),
    "EXPLAIN": explain_prompt | llm | StrOutputParser(),
    "PROCEDURE": procedure_prompt | llm | StrOutputParser(),
    "ADVICE": advice_prompt | llm | StrOutputParser(),
    "COMPARISON": comparison_prompt | llm | StrOutputParser(),
    "GENERAL": general_prompt | llm | StrOutputParser(),
}[x["intent"].strip()])

# New generator LLM
new_generator = generator_prompt | llm | StrOutputParser()

## Hallucination Detection LLM 

class hallucinate_class(BaseModel):
  datasource: Literal["yes", "mild", "no"] = Field(
        ...,
        description="Given a generated output and context determine whether the generated output is factually aligned with the context.",
  )

hallucinator = hallucinator_prompt | llm.with_structured_output(hallucinate_class)

## Answer Grader LLM 

class answering_class(BaseModel):
  datasource: Literal["Relevant", "Somewhat", "Irrelevant"] = Field(
      ...,
      description = "Given a generated output and the user query determine whether the generated output answers the user query."
  )

answer_grader = answering_prompt | llm.with_structured_output(answering_class)

## Question Rewritter LLM

rewritter = rewritting_prompt | llm | StrOutputParser()

## Query Reveiwer LLM 

class reviewing_class(BaseModel):
  datasource: Literal["yes", "no"] = Field(
      ...,
      description = "Given a question, determine if there is enough information in the query to engage in meaningful retrieval."
  )

reviewer = reviewing_prompt | llm.with_structured_output(reviewing_class)

## Follow-up question LLM 

asker = asking_prompt | llm | StrOutputParser()


## summariser LLM 
summariser = history_summariser_prompt | llm | StrOutputParser()