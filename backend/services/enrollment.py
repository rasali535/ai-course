from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.enrollment_model import EnrollmentModel

async def handle_paypal_enrollment(db: AsyncSession, user_id: str, course_id: int) -> EnrollmentModel:
    """
    Service logic to handle course enrollment after a successful PayPal payment event.
    If the enrollment already exists, mark it as paid.
    If it doesn't exist, create it and mark it as paid.
    """
    result = await db.execute(
        select(EnrollmentModel)
        .where(EnrollmentModel.user_id == user_id, EnrollmentModel.course_id == course_id)
    )
    enrollment = result.scalar_one_or_none()
    
    if enrollment:
        enrollment.is_paid = True
    else:
        enrollment = EnrollmentModel(
            user_id=user_id,
            course_id=course_id,
            is_paid=True,
            progress_data={}
        )
        db.add(enrollment)
        
    await db.commit()
    await db.refresh(enrollment)
    return enrollment
