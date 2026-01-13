import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import curriculumApi from '../api/curriculumApi';

export const useCurriculums = (params) => {
    return useQuery({
        queryKey: ['curriculums', params],
        queryFn: () => curriculumApi.getAll(params),
        keepPreviousData: true,
    });
};

export const useCurriculum = (id) => {
    return useQuery({
        queryKey: ['curriculums', id],
        queryFn: () => curriculumApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateCurriculum = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: curriculumApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['curriculums']);
        },
    });
};

export const useUpdateCurriculum = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => curriculumApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['curriculums']);
        },
    });
};

export const useDeleteCurriculum = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: curriculumApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['curriculums']);
        },
    });
};
