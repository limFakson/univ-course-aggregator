import { useParams, useNavigate } from 'react-router-dom';
import { sampleCourses } from '@/data/courses';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null)
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {

        const res = await fetch(`http://localhost:8000/courses/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        // The courses array is under data.courses
        setCourse(data.course || {});
      } catch (err) {
        // setError(err.message || "Failed to load courses.");
      } finally {
      }
    };

    fetchCourses();
  }, [id]);

  if (!course) {
    return (
      <div className="max-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <p className="text-foreground">Course not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        <Card className="p-8 border border-[#d4d2d2]">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.university}</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Duration</h3>
                <p className="text-muted-foreground">{course.duration}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-1">Location</h3>
                <p className="text-muted-foreground">{course.location}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-1">Fees</h3>
                <p className="text-muted-foreground">{course.fees}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Schedule</h3>
                <p className="text-muted-foreground">{course.schedule}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-1">Instructor</h3>
                <p className="text-muted-foreground">{course.instructor}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-1">Credits</h3>
                <p className="text-muted-foreground">{course.credits}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Course Description</h3>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-1">
                {course.requirements.map((requirement, index) => (
                  <li key={index} className="text-muted-foreground">{requirement}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetail;