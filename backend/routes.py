from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.models import Task, TaskCreate, DBTask
from backend.database import get_db

task_routes = APIRouter()

@task_routes.post("", response_model=Task)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = DBTask(title=task.title, description=task.description, completed=task.completed)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@task_routes.get("", response_model=list[Task])
def get_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tasks = db.query(DBTask).offset(skip).limit(limit).all()
    return tasks

@task_routes.put("/{task_id}", response_model=Task)
def update_task(task_id: int, updated_task: TaskCreate, db: Session = Depends(get_db)):
    db_task = db.query(DBTask).filter(DBTask.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.title = updated_task.title
    db_task.description = updated_task.description
    db_task.completed = updated_task.completed
    
    db.commit()
    db.refresh(db_task)
    return db_task

@task_routes.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(DBTask).filter(DBTask.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully!"}

@task_routes.delete("")
def delete_all_tasks(db: Session = Depends(get_db)):
    db.query(DBTask).delete()
    db.commit()
    return {"message": "All tasks deleted successfully!"}
