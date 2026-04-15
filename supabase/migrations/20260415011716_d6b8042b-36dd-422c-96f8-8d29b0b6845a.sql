
CREATE OR REPLACE FUNCTION public.auto_confirm_appointment()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.status = 'confirmed';
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_confirm_appointment_trigger
BEFORE INSERT ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.auto_confirm_appointment();
