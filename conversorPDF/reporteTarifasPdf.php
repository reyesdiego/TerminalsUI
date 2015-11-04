<?php

include_once 'pdf/fpdf.php';
include_once 'util.php';

class PDF extends FPDF
{
	var $terminal;

	function setTerminal($unaTerminal){
		$this->terminal = $unaTerminal;
	}

	function Header()
	{
		//Logo
		$this->Image('imagenes/logo.jpg',10,8,40);
		//Arial bold 15
		$this->SetFont('Arial','B',16);
		//Movernos a la derecha

		//Título
		$this->SetX(50);
		$this->Cell(110,10,utf8_decode('Sistema de Control de Terminales'),0,0,'C');
		$this->Ln();
		$this->SetX(50);
		$this->Cell(110,10,utf8_decode('Reporte de Tarifas'),0,0,'C');

		//Salto de línea
		$this->Ln(15);
	}

	function Footer()
	{
		//Posición: a 1,5 cm del final
		$this->SetY(-15);
		$y = $this->GetY();
		$this->Line(10, $y, 200, $y);
		//Arial italic 8
		$this->SetFont('Arial','I',8);
		//Número de página
		$this->Cell(20,10,utf8_decode('Página ').$this->PageNo().'/{nb}',0,0,'L');
		$this->Cell(165, 10, utf8_decode("Administración General de Puertos S.E. - Departamento de Desarrollo"), 0, 0, "R");
		$this->Image("imagenes/logo_puertochico.jpg", $this->GetX(), $this->GetY() + 2, 5);
	}

	function CheckPageBreak($h)
	{
		//If the height h would cause an overflow, add a new page immediately
		if($this->GetY()+$h>$this->PageBreakTrigger)
			$this->AddPage($this->CurOrientation);
	}

	function NbLines($w, $txt)
	{
		//Computes the number of lines a MultiCell of width w will take
		$cw=&$this->CurrentFont['cw'];
		if($w==0)
			$w=$this->w-$this->rMargin-$this->x;
		$wmax=($w-2*$this->cMargin)*1000/$this->FontSize;
		$s=str_replace("\r", '', $txt);
		$nb=strlen($s);
		if($nb>0 and $s[$nb-1]=="\n")
			$nb--;
		$sep=-1;
		$i=0;
		$j=0;
		$l=0;
		$nl=1;
		while($i<$nb)
		{
			$c=$s[$i];
			if($c=="\n")
			{
				$i++;
				$sep=-1;
				$j=$i;
				$l=0;
				$nl++;
				continue;
			}
			if($c==' ')
				$sep=$i;
			$l+=$cw[$c];
			if($l>$wmax)
			{
				if($sep==-1)
				{
					if($i==$j)
						$i++;
				}
				else
					$i=$sep+1;
				$sep=-1;
				$j=$i;
				$l=0;
				$nl++;
			}
			else
				$i++;
		}
		return $nl;
	}
}

$data = get_post();
$id = $data['id'];
$desde = date('d/m/Y', strtotime($data['desde']));
$hasta = date('d/m/Y', strtotime($data['hasta']));
$hoy = date('d/m/Y', strtotime($data['hoy']));

foreach ($data['charts'] as $chart) {
	$chart['image'] = substr($chart['image'], 1+strrpos($chart['image'], ','));
	$chart['image'] = base64_decode($chart['image']);

	file_put_contents(".temp/" . $chart['filename'] . $id . ".jpg", $chart['image']);
}

$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(190, 8, utf8_decode('Reporte generado el ' . $hoy), 0, "L");
$pdf->Ln();
$pdf->Cell(190, 8, utf8_decode('Período controlado: Del ' . $desde . ' hasta el ' . $hasta), 0, "L");
$pdf->Ln(10);

$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(30, 5, "", 1, 0);
foreach($data['tabla']['terminales'] as $terminal){
	$pdf->Cell(40, 5, $terminal, 1, 0, "C");
}
$pdf->Cell(40, 5, "Total", 1, 0, "C");
$pdf->Ln();

$pdf->SetFont('Arial', '', 8);
foreach ($data['tabla']['data'] as $datos) {
	$pdf->Cell(30, 5, $datos['code'], 1, 0, "C");
	$i = 0;
	foreach ($datos['conteo'] as $conteo){
		if ($conteo > 0){
			$poner = "US$ " . number_format($conteo, 2);
			if ($i != 3){
				$poner .=  "(" . number_format($datos['porcentaje'][$i], 2) . " %)";
			}
		} else {
			$poner = " - ";
		}

		$pdf->Cell(40, 5, $poner, 1, 0, "C");
		$i++;
	}
	$pdf->Ln();
}

$pdf->SetFont('Arial', 'B', 9);
$pdf->Cell(30, 5, "Totales", 1, 0, "C");
foreach($data['totales'] as $total){
	$pdf->Cell(40, 5, "US$ " . number_format($total, 2), 1, 0, "C");
}
$pdf->Ln();

$pdf->Image(".temp/1" . $id . ".jpg", $pdf->GetX() - 10, $pdf->GetY() + 2, 200);

$pdf->Image(".temp/2" . $id . ".jpg", $pdf->GetX() - 10, $pdf->GetY() + 100, 120);
$pdf->Image(".temp/3" . $id . ".jpg", 100, $pdf->GetY() + 100, 120);

$pdf->Output();
