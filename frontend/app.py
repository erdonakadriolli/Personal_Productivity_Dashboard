import streamlit as st
from task_form import add_task_form
from task_display import display_tasks

st.title("Personal Productivity Dashboard")

add_task_form()
display_tasks()
