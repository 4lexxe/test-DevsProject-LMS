import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeroCourse from "@/course/components/CourseDetail/HeroCourse";
import CourseOverview from "@/course/components/CourseDetail/CourseOverview";
import LearningOutcomes from "@/course/components/CourseDetail/LearningOutcomes";
import Prerequisites from "@/course/components/CourseDetail/Prerequisites";
import SectionList from "@/course/components/CourseDetail/SectionList";
import PurchaseButtons from "@/course/components/CourseDetail/PurchaseButtons";
import PricingCard from "@/course/components/CourseDetail/PricingCard";
import { getById } from "@/course/services/courseServices";
import { checkCourseAccess } from "@/course/services/directPurchaseService";
const CourseDetails = () => {
    const params = useParams();
    const { id } = params;
    const navigate = useNavigate();
    console.log('🔍 CourseDetails - Params completos:', params);
    console.log('🔍 CourseDetails - ID de URL:', id, 'tipo:', typeof id);
    console.log('🔍 CourseDetails - window.location.pathname:', window.location.pathname);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [moduleCount, setModuleCount] = useState(0);
    useEffect(() => {
        const fetchCourseData = async () => {
            if (!id) {
                setError("ID del curso no válido.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                // Verificar si el usuario ya tiene acceso al curso
                try {
                    const accessResponse = await checkCourseAccess(id);
                    if (accessResponse.hasAccess) {
                        console.log('🔄 Usuario ya tiene acceso al curso, redirigiendo a my-course...');
                        navigate(`/my-course/${id}`);
                        return;
                    }
                }
                catch (accessError) {
                    // Si hay error verificando acceso (ej: usuario no autenticado), continuar mostrando el curso
                    console.log('ℹ️ No se pudo verificar acceso (posiblemente usuario no autenticado), mostrando curso normal');
                }
                const course = await getById(id);
                if (course) {
                    setCourse(course);
                    const count = course.sections.length;
                    setModuleCount(count);
                }
                else {
                    setError("Curso no encontrado.");
                }
            }
            catch (err) {
                console.error("Error al cargar el curso:", err);
                setError("Hubo un error al cargar los datos del curso.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id, navigate]);
    if (loading) {
        return _jsx("p", { className: "p-6 text-blue-500", children: "Cargando curso..." });
    }
    if (error) {
        return _jsx("p", { className: "p-6 text-red-500", children: error });
    }
    if (!course) {
        return _jsx("p", { className: "p-6 text-red-500", children: "Curso no encontrado." });
    }
    return (_jsxs("div", { children: [_jsx("div", { className: "w-full", children: _jsx(HeroCourse, { title: course.title, description: course.summary, image: course.image, categories: course.categories, courseId: id }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-1 lg:order-2 flex flex-col space-y-6", children: [course.prerequisites && course.prerequisites.length > 0 && (_jsx("div", { className: "border border-gray-200 rounded-lg p-6 bg-white shadow-sm", children: _jsx(Prerequisites, { prerequisites: course.prerequisites }) })), _jsx("div", { className: "border border-gray-200 rounded-lg p-6 bg-white shadow-sm", children: _jsx(LearningOutcomes, { outcomes: course.learningOutcomes }) }), _jsx(PricingCard, { pricing: course.pricing }), id && (_jsx("div", { className: "mt-6", children: _jsx(PurchaseButtons, { courseId: id, pricing: course.pricing, className: "shadow-lg" }) }))] }), _jsxs("div", { className: "lg:col-span-2 lg:order-1", children: [_jsx(CourseOverview, { about: course.about, careerType: course.careerType?.name || 'Sin categoría', numberOfModules: moduleCount, createdAt: course.createdAt }), _jsx("div", { className: "flex items-center justify-between mb-6 mt-8", children: _jsx("div", { className: "flex items-center gap-4", children: _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "M\u00F3dulos del Curso" }) }) }), _jsx("div", { className: "mt-6", children: _jsx(SectionList, { courseId: id || "" }) })] })] }) })] }));
};
export default CourseDetails;
