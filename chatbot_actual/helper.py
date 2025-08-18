from chatbot_actual.llm import *
from chatbot_actual.indexing import *

def retrieve_documents(vectorstore, query, k=5):
    return vectorstore.similarity_search_with_score(query, k=k)

def get_chat_summary(history):
  print("--- Received Chat History!--- \n Chat History Length:", len(history))
  if len(history) == 0: 
    return ""
  else:
    try:
      summary = summariser.invoke({"summary": history})
      return summary
    except Exception as e:
      print("---Error: Failed to generate chat summary---")
      print(f"Reason: {e}")
      summary = None

def routing(question, summary):
  try:
    route = analysis_router.invoke({"question": question, "summary": summary})
    route = route.datasource
  except Exception as e:
    print("---Error: Router failed to route query---")
    print(f"Reason: {e}")
    route = None
  print(f"--- Routed to {route}---")
  if route == "vectorstore":
    return True
  elif route == "casual_chat":
    return False
  else:
    print(f"---Error: Router routed to {route}---")
    return None

def intentions(question, summary):
  print("---Determining Intent")
  try:
    intent = intent_router.invoke({"question": question, "summary": summary})
    intent = intent.datasource
    print(f"---Intent identified as {intent}---")
  except Exception as e:
    print("---Error: Intent detection failed---")
    print(f"Reason: {e}")
    intent = None
  return intent


def casual(question):
  print("---Generating casual output---")
  try:
    response = casual_llm.invoke({'question': question})
    response = response.content
  except Exception as e:
    print("---Error: Casual Chatbot failed to generate output---")
    print(f"Reason: {e}")
    response = "Error Code 1: Casual Chatbot failed to generate output."
  return response

def stepback_translation(question, intent):
  print("---Step-back Translation---")
  try:
    translation = stepback.invoke({"question": question, "intent": intent})
    print(f"---Step-back Translation: {translation}")
  except Exception as e:
    print("---Error: Step-back translation failed---")
    print(f"Reason: {e}")
    translation = None
  return translation


def bad_grading(question):
  print('---Rewriting Question---')
  try:
    new_question = rewritter.invoke({"question": question})
    return new_question
  except Exception as e:
    print("---Error: Rewriting failed---")
    print(f"Reason: {e}")
    return None

def retrieval(vectorstore,question, retries): # retrieve and evaluate retrieved documents
  if retries > 3:
    print("--- Error: Too many retries, ask another question!---")
    return False
  print(f"Retrieval Retry Number: {retries}")
  try:
    context = retrieve_documents(vectorstore, question)
    filtered_context = [(doc, score) for doc, score in context if score <= 0.4]
    page_contents = [doc.page_content for doc, score in filtered_context]
  except Exception as e:
    print("---Error: Retriever failed to retrieve documents---")
    print(f"Reason: {e}")
    return None
  print("---Grading documents---")
  try:
    grade = grader.invoke({"document": page_contents, "question": question})
    grade = grade.datasource
  except Exception as e:
    print("---Error: Grader failed to grade---")
    print(f"Reason: {e}")
    grade = None
  if grade == "Relevant" or grade == "Somewhat":
    print(f"---Documents are {grade}---")
    return page_contents
  elif grade == 'Irrelevant':
    print("---Documents are not relevant---")
    new_question = bad_grading(question)
    if new_question == None:
      raise Exception ("Error code 3: Rewritter failed")
    retries += 1
    return retrieval(vectorstore, new_question, retries)
  else:
    print(f"---Error: Grader graded documents as {grade}")
    return None

def generation(question, normal_context, step_back_context, intent, summary):
  print("---Generating the output---")
  try:
    output = new_generator.invoke({'question': question, 'normal_context':normal_context, "step_back_context": step_back_context, 'intent': intent, 'summary': summary})
  except Exception as e:
    print("---Error: Generator failed to generate output---")
    print(f"Reason: {e}")
    output = None
  return output

def hallucation_detector(documents, answer, summary):
  print("---Detecting Hallucination---")
  try:
    hallucinate = hallucinator.invoke({'documents': documents, 'answer': answer, 'summary': summary})
    hallucinate = hallucinate.datasource
  except Exception as e:
    print("---Error: Hallucinator failed in detecting hallucination---")
    print(f"Reason: {e}")
  if hallucinate == 'yes':
    print("---Hallucination Detected---")
    return True
  elif hallucinate == 'no' or hallucinate == 'mild':
    print("---No Hallucination Detected---")
    return False
  else:
    print(f"---Error: Hallucinator returned {hallucinate}")
    return None

def accuracy_checker(question, answer):
  print("---Checking Output Accuracy---")
  try:
    grade = answer_grader.invoke({'question':question, 'generation': answer})
    grade = grade.datasource
  except Exception as e:
    print("---Error: Answer Grader failed to Grade answer")
    print(f"Reason:{e}")
  if grade == 'Relevant' or grade == 'Somewhat':
    return True
  elif grade == 'Irrelevant':
    print("---Answer is not accurate---")
    return False
  else:
    print(f"---Error: Answer Grader returned {grade}")
    return None
  
def format_output(output):
  paragraphs = output.strip().split('\n\n')
  formatted_output = ''.join(f'{p.strip()}</p>' for p in paragraphs if p.strip())
  return formatted_output

def vectoring(vectorstore, question, summary):
  # intent detection step
  intent = intentions(question, summary)
  if intent:
  # step back translation
    step_back_question = stepback_translation(question, intent)
    if step_back_question == None:
      raise Exception("Error code 2b: Failed to generate stepback question")
  elif intent == None:
    raise Exception("Error code 2a: Intent detection failed")
  # get normal context and stepback context
  normal_context = retrieval(vectorstore, question, 0)
  if normal_context == None:
    raise Exception("Error code 2c: Failed to retreive normal context")
  elif normal_context == False:
    output = "I'm sorry, I am not trained to answer this question. Please try another one!"
    return output
  step_back_context = retrieval(vectorstore, step_back_question, 0)
  if step_back_context == None:
    raise Exception("Error code 2d: Failed to retreive stepback context")
  elif step_back_context == False:
    output = "I'm sorry, I am not trained to answer this question. Please try another one!"
    return output
  # Generate the output and validate
  max_retries, retries = 3, 0
  while retries <= max_retries:
    print(f"Generator Retry Number: {retries}")
    output = generation(question, normal_context, step_back_context, intent, summary)
    if output == None:
      raise Exception("Error code 2f: Failed to generate output")
    hallucinate = hallucation_detector(normal_context + step_back_context, output, summary)
    if hallucinate == None:
      raise Exception("Error code 2e: Failed to run hallucination detector")
    if hallucinate == False:
      break
    else:
      retries += 1
  if retries > max_retries:
    output = "Sorry, I am not able to generate a good response for you :< \nFor a detailed answer, please contact James at james.yeo@performancenutrition.sg"
  return output

def redo(question, output, vectorstore, summary, retries):
  print(f"--- Attempt Number {retries} ---")
  if retries > 2:
    print("---Error: Too many retries, ask another question!---")
    return "Sorry, I am not able to generate a good response for you :< \nFor a detailed answer, please contact James at james.yeo@performancenutrition.sg"
  if accuracy_checker(question, output):
    output = format_output(output)
    return output
  elif not accuracy_checker(question, output):
    return redo(question, vectoring(vectorstore ,question, summary), vectorstore, summary, retries + 1)
  elif accuracy_checker(question, output) == None:
    raise Exception("Error code 2g: Accuracy checker failed")
  
def rag_initialisation(file): # set up the vectorstore 
  print("--- Setting Up the Vector Store Now...---")
  # load documents // split documents
  texts = receive(file)
  # embed documents
  embed(texts)
  return

def rag_activation(question, history):
  # get chat summary
  summary = get_chat_summary(history)
  route = routing(question, summary)
  if not route:
    return casual(question)
  elif route:
    vectorstore = get_vector_store()
    return redo(question, vectoring(vectorstore, question, summary), vectorstore, summary, retries = 1)
  elif route == None:
    raise Exception("Error code 2h: Routing failed")
  
def handle_new_file(local_path):
    # store the files into the Datastore inside GCS
    try:
        uploaded_files, rejected_files = upload_to_r2(local_path)
    except Exception as e:
        print("---Error: File Upload to Cloudflare R2 Failed ---")
        print(f"Reason: {e}")

    # update current chroma_db with the new embeddedings#
    texts = receive(local_path)
    if not embed(texts):
        raise Exception("--- Error: Text Emedding Failed---")
    if not upload_chroma_to_r2():
        raise Exception("---Error: Failed to upload Chroma to Cloud---")
    
    print(f"Total number of files uploaded: {len(uploaded_files)}")
    print(f"Rejected Files: {rejected_files}")

    return (uploaded_files, rejected_files)   