import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import teacherApi from '../api/teacherApi';

export const useTeachers = (params) => {
    return useQuery({
        queryKey: ['teachers', params],
        queryFn: () => teacherApi.getAll(params),
        keepPreviousData: true,
    });
};

export const useTeacher = (id) => {
    return useQuery({
        queryKey: ['teachers', id],
        queryFn: () => teacherApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: teacherApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['teachers']);
        },
    });
};

export const useUpdateTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => teacherApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['teachers']);
        },
    });
};

export const useDeleteTeacher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: teacherApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['teachers']);
        },
    });
};
