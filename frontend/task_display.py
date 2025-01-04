import streamlit as st
import requests

BASE_URL = "http://127.0.0.1:8000/tasks"

def display_tasks():
    st.header("Tasks")
    tasks = requests.get(BASE_URL).json()
    for task in tasks:
        st.write(f"**{task['title']}**: {task['description']} (Completed: {task['completed']})")
        if st.button(f"Mark as Completed - {task['id']}"):
            task['completed'] = True
            requests.put(f"{BASE_URL}/{task['id']}", json=task)
            st.experimental_rerun()
