from fastapi import APIRouter
from models import Task

task_routes = APIRouter()

tasks = []

@task_routes.post("/")
async def create_task(task: Task):
    tasks.append(task)
    return {"message": "Task added successfully!"}

@task_routes.get("/")
async def get_tasks():
    return tasks

@task_routes.put("/{task_id}")
async def update_task(task_id: int, updated_task: Task):
    for task in tasks:
        if task.id == task_id:
            task.title = updated_task.title
            task.description = updated_task.description
            task.completed = updated_task.completed
            return {"message": "Task updated successfully!"}
    return {"error": "Task not found"}
