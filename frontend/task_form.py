import streamlit as st
import requests

BASE_URL = "http://127.0.0.1:8000/tasks"

def add_task_form():
    st.header("Add a Task")
    title = st.text_input("Title")
    description = st.text_area("Description")
    if st.button("Add Task"):
        task_id = len(requests.get(BASE_URL).json()) + 1
        response = requests.post(BASE_URL, json={"id": task_id, "title": title, "description": description, "completed": False})
        if response.status_code == 200:
            st.success("Task added successfully!")
